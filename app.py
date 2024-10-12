from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pathlib import Path
import google.generativeai as genai
from pdf2image import convert_from_path
import threading
import os
from werkzeug.utils import secure_filename
import zipfile
from io import BytesIO
import pandas as pd

app = Flask(__name__)
CORS(app)  # Activer CORS pour toutes les routes

# Configurer la clé API Google
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'AIzaSyB0B48Vs2dJjdVK4_Ru5WZ1uZ75nQS45-o')
if not GOOGLE_API_KEY:
    raise ValueError("Clé API introuvable. Veuillez définir la variable d'environnement GOOGLE_API_KEY.")

genai.configure(api_key=GOOGLE_API_KEY)

# Configurer le modèle génératif
MODEL_CONFIG = {
    "temperature": 0.2,
    "top_p": 0.9,
    "top_k": 32,
    "max_output_tokens": 2048,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=MODEL_CONFIG,
    safety_settings=safety_settings
)

# Fonction pour convertir un PDF en PNG
def convert_pdf_to_png(pdf_path, output_folder):
    pages = convert_from_path(pdf_path, 200)
    image_paths = []
    Path(output_folder).mkdir(parents=True, exist_ok=True)
    for i, page in enumerate(pages):
        image_path = Path(output_folder) / f"page_{i+1}.png"
        page.save(image_path, 'PNG')
        image_paths.append(str(image_path))
    return image_paths

# Fonction pour formater l'image pour le traitement
def image_format(image_path):
    img = Path(image_path)
    if not img.exists():
        raise FileNotFoundError(f"Image introuvable: {img}")
    image_parts = [
        {
            "mime_type": "image/png",
            "data": img.read_bytes()
        }
    ]
    return image_parts

# Fonction pour traiter l'image et générer le contenu avec le modèle
def gemini_output(image_path, system_prompt, user_prompt):
    image_info = image_format(image_path)
    input_prompt = [system_prompt, image_info[0], user_prompt]
    response = model.generate_content(input_prompt)
    return response.text

# Fonction thread pour traiter les images en parallèle
def process_image_thread(image_path, system_prompt, user_prompt, results, index):
    results[index] = gemini_output(image_path, system_prompt, user_prompt)

@app.route('/process-files', methods=['POST'])
def process_files():
    if 'files' not in request.files or 'user_prompt' not in request.form:
        return jsonify({"error": "Fichiers ou 'user_prompt' manquant dans la requête"}), 400

    user_prompt = request.form['user_prompt']
    files = request.files.getlist('files')
    
    system_prompt = """
  Veuillez extraire les informations suivantes et les renvoyer sous forme de JSON.

Les informations extraites doivent inclure si possible :
- Le nom du client (nomClient),
- Le nom du fournisseur (nomFournisseur, correspondant au nom de la société),
- La date de la facture (dateFacture) au format `yyyy-mm-ddTHH:mm:ssZ`,
- Le numéro de la facture (numFacture),
- Le montant total TTC ou montant fiscal (montantFiscal),
- Les frais d'immatriculation (matriculeFiscale),
- Le code complet de la TVA (codeTVA),
- Le montant HT (montantHT),
- Le total TVA (totalTVA),
- Le timbre fiscal (timbreFiscal).

Assurez-vous que tous les montants (`montantHT`, `totalTVA`, `timbreFiscal`, `montantFiscal`) sont correctement formatés avec des virgules pour les décimales, si nécessaire.
 {
  "nomFournisseur": "",
  "nomClient": "",
  "dateFacture": "yyyy-mm-ddTHH:mm:ssZ",
  "numFacture": "",
  "montantFiscal": ,
  "matriculeFiscale": "",
  "codeTVA": "",
  "montantHT": ,
  "totalTVA": ,
  "timbreFiscal": 
}
    """

    output_folder = "uploads"
    Path(output_folder).mkdir(parents=True, exist_ok=True)
    
    try:
        all_outputs = []
        file_urls = []

        for file in files:
            filename = secure_filename(file.filename)
            file_path = Path(output_folder) / filename
            file.save(file_path)
            
            if file_path.suffix.lower() == '.pdf':
                image_paths = convert_pdf_to_png(file_path, output_folder)
            else:
                image_paths = [file_path]
            
            outputs = [None] * len(image_paths)
            threads = []
            for i, image_path in enumerate(image_paths):
                thread = threading.Thread(target=process_image_thread, args=(image_path, system_prompt, user_prompt, outputs, i))
                threads.append(thread)
                thread.start()

            for thread in threads:
                thread.join()

            all_outputs.append(outputs)
            file_urls.append({
                "filename": filename,
                "url": f"/download-file/{filename}"
            })

        return jsonify({"outputs": all_outputs, "file_urls": file_urls})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download-file/<filename>', methods=['GET'])
def download_file(filename):
    output_folder = "uploads"
    file_path = os.path.join(output_folder, filename)
    
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "Fichier introuvable."}), 404

@app.route('/download-outputs', methods=['GET'])
def download_outputs():
    output_folder = "uploads"

    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        for root, dirs, files in os.walk(output_folder):
            for file in files:
                file_path = os.path.join(root, file)
                zip_file.write(file_path, os.path.relpath(file_path, output_folder))
    
    zip_buffer.seek(0)

    return send_file(zip_buffer, attachment_filename='extracted_files.zip', as_attachment=True)

@app.route('/download-csv', methods=['GET'])
def download_csv():
    output_folder = "uploads"
    all_dfs = []

    for file in os.listdir(output_folder):
        if file.endswith('.csv'):
            file_path = os.path.join(output_folder, file)
            df = pd.read_csv(file_path)
            all_dfs.append(df)

    if all_dfs:
        combined_df = pd.concat(all_dfs, ignore_index=True)

        csv_buffer = BytesIO()
        combined_df.to_csv(csv_buffer, index=False)

        csv_buffer.seek(0)

        return send_file(csv_buffer, attachment_filename='combined_files.csv', as_attachment=True)
    else:
        return jsonify({"error": "Aucun fichier CSV trouvé."}), 404

@app.route('/download-excel', methods=['GET'])
def download_excel():
    output_folder = "uploads"
    all_dfs = []

    for file in os.listdir(output_folder):
        if file.endswith('.xlsx'):
            file_path = os.path.join(output_folder, file)
            df = pd.read_excel(file_path)
            all_dfs.append(df)

    if all_dfs:
        combined_df = pd.concat(all_dfs, ignore_index=True)

        excel_buffer = BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
            combined_df.to_excel(writer, index=False)

        excel_buffer.seek(0)

        return send_file(excel_buffer, attachment_filename='combined_files.xlsx', as_attachment=True)
    else:
        return jsonify({"error": "Aucun fichier Excel trouvé."}), 404

@app.route('/download-single-file-excel/<filename>', methods=['GET'])
def download_single_file_excel(filename):
    output_folder = "uploads"
    file_path = os.path.join(output_folder, filename)

    if os.path.exists(file_path) and filename.endswith('.xlsx'):
        df = pd.read_excel(file_path)

        excel_buffer = BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False)

        excel_buffer.seek(0)

        return send_file(excel_buffer, attachment_filename=filename, as_attachment=True)
    else:
        return jsonify({"error": "Fichier Excel introuvable."}), 404

@app.route('/download-combined-excel', methods=['GET'])
def download_combined_excel():
    output_folder = "uploads"
    all_dfs = []
    files_info = []

    for file in os.listdir(output_folder):
        file_path = os.path.join(output_folder, file)
        files_info.append({
            "filename": file,
            "url": f"/download-file/{file}"
        })

        if file.endswith('.xlsx'):
            df = pd.read_excel(file_path)
            all_dfs.append(df)

    combined_df = pd.concat(all_dfs, ignore_index=True) if all_dfs else pd.DataFrame()

    excel_buffer = BytesIO()
    with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
        combined_df.to_excel(writer, index=False)
        file_details_df = pd.DataFrame(files_info)
        file_details_df.to_excel(writer, sheet_name='File Details', index=False)

    excel_buffer.seek(0)
    return send_file(excel_buffer, attachment_filename='combined_files_with_details.xlsx', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)


