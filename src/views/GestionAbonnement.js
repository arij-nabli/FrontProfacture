import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button, FormGroup, Label, Input, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const GestionAbonnement = () => {
  const [planSelectionne, setPlanSelectionne] = useState(null);
  const [frequencePaiement, setFrequencePaiement] = useState('Mensuel');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [codePromo, setCodePromo] = useState('');
  const [prixFinal, setPrixFinal] = useState(0);
  const [modalMessage, setModalMessage] = useState('');
  const [showPaymentCard, setShowPaymentCard] = useState(false);

  const plans = [
    { nom: 'Mensuel', prixMensuel: 30, prixAnnuel: 0, credits: 'Extraction illimitée, Support Prioritaire' },
    { nom: 'Semestriel', prixMensuel: 25, prixAnnuel: 150, credits: 'Extraction illimitée, Support Prioritaire' },
    { nom: 'Annuel', prixMensuel: 20, prixAnnuel: 240, credits: 'Extraction illimitée, Support Prioritaire',  },
  ];

  const handlePlanChange = (plan) => {
    setPlanSelectionne(plan);
    setMessage('');
    setModalOpen(true);
    setCodePromo('');
    setModalMessage('');
    setPrixFinal(calculateFinalPrice(plan, frequencePaiement));
  };

  const handleFrequenceChange = (event) => {
    const newFrequence = event.target.value;
    setFrequencePaiement(newFrequence);
    if (planSelectionne) {
      setPrixFinal(calculateFinalPrice(planSelectionne, newFrequence));
    }
  };

  const handleAnnulerAbonnement = () => {
    if (!planSelectionne) {
      setMessage('Vous êtes déjà sur le plan Gratuit.');
    } else {
      console.log('Abonnement annulé');
      setMessage('Abonnement annulé avec succès.');
      setPlanSelectionne(null);
      setModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  const handleConfirmerAbonnement = () => {
    setMessage('Abonnement confirmé');
    setModalOpen(false);
    setShowPaymentCard(true);
  };

  const handleAppliquerCodePromo = () => {
    if (planSelectionne) {
      const prixFinalAvecPromo = calculateFinalPrice(planSelectionne, frequencePaiement, codePromo);
      if (prixFinalAvecPromo === null) {
        setModalMessage('Le code promo n\'est pas valide.');
      } else {
        setPrixFinal(prixFinalAvecPromo);
        setModalMessage('Code promo appliqué.');
      }
    }
  };

  const calculateFinalPrice = (plan, frequence, promoCode = '') => {
    let prix = frequence === 'Mensuel' ? plan.prixMensuel : plan.prixAnnuel;
    if (promoCode) {
      if (promoCode === 'PROMO10') prix *= 0.9;
      else if (promoCode === 'PROMO15') prix *= 0.85;
      else if (promoCode === 'PROMO20') prix *= 0.8;
      else return null;
    }
    return prix.toFixed(2);
  };

  const selectedPlan = planSelectionne;

  return (
    <Container>
      {!showPaymentCard ? (
        <>
          <Row className="text-center mt-4">
            <Col lg="12">
              <FormGroup>
                <Label for="frequencePaiement">Fréquence de Paiement</Label>
                <Input type="select" id="frequencePaiement" value={frequencePaiement} onChange={handleFrequenceChange}>
                  <option value="Mensuel">Mensuel</option>
                  <option value="Annuel">Annuel</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          {message && (
            <Row className="text-center">
              <Col lg="12">
                <Alert color={message.includes('erreur') ? 'danger' : 'success'}>
                  {message}
                </Alert>
              </Col>
            </Row>
          )}
          <Row className="row-grid align-items-center">
            {plans.map(plan => (
              <Col md="4" key={plan.nom}>
                <Card className={`card-pricing border-0 mb-5 mb-lg-0 ${planSelectionne?.nom === plan.nom ? 'selected' : ''}`}>
                  <CardBody className="py-5 text-center">
                    <h6 className="text-primary text-uppercase">{plan.nom}</h6>
                    <h1 className="display-2">
                      {frequencePaiement === 'Mensuel' ? `$${plan.prixMensuel}` : `$${plan.prixAnnuel}`}
                      <span className="text-muted"> {frequencePaiement === 'Mensuel' ? '/ mois' : '/ an'}</span>
                    </h1>
                    <p>{plan.credits}</p>
                    {plan.reduction && (
                      <p className="text-success mt-3" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{plan.reduction}</p>
                    )}
                    <Button
                      className="btn btn-primary mt-4"
                      onClick={() => handlePlanChange(plan)}
                      style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
                    >
                      Choisir l'abonnement
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal isOpen={modalOpen} toggle={handleModalClose}>
            <ModalHeader toggle={handleModalClose}>Confirmation d'Abonnement</ModalHeader>
            <ModalBody>
              {selectedPlan ? (
                <Card className="border-0 mb-5 mb-lg-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CardBody className="py-5 text-center">
                    <h6 className="text-primary text-uppercase">{selectedPlan.nom}</h6>
                    <h1 className="display-2">
                      ${prixFinal}
                      <span className="text-muted"> {frequencePaiement === 'Mensuel' ? '/ mois' : '/ an'}</span>
                    </h1>
                    <FormGroup className="mt-4">
                      <Label for="codePromo">Avez-vous un code promo ?</Label>
                      <Input
                        type="text"
                        id="codePromo"
                        value={codePromo}
                        onChange={(e) => setCodePromo(e.target.value)}
                        placeholder="Entrez le code promo"
                      />
                      <Button
                        color="success"
                        className="mt-2"
                        onClick={handleAppliquerCodePromo}
                      >
                        Appliquer
                      </Button>
                    </FormGroup>
                    {modalMessage && (
                      <Alert color="danger" className="mt-3">
                        {modalMessage}
                      </Alert>
                    )}
                  </CardBody>
                </Card>
              ) : (
                <p>Aucun plan sélectionné</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleConfirmerAbonnement}>Confirmer</Button>
              <Button color="secondary" onClick={handleModalClose}>Annuler</Button>
            </ModalFooter>
          </Modal>
        </>
      ) : (
        <Row className="justify-content-center mt-5">
          <Col md="8">
            <Card className="border-0">
              <CardBody className="py-5">
                <h3 className="text-center">Saisissez vos données de paiement</h3>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input type="email" id="email" placeholder="Entrez votre e-mail" />
                </FormGroup>
                <FormGroup>
                  <Label for="cardInfo">Informations de la carte</Label>
                  <Input type="text" id="cardInfo" placeholder="1234 1234 1234 1234" />
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cardType">Type de carte</Label>
                        <Input type="select" id="cardType">
                          <option value="Visa">Visa</option>
                          <option value="MasterCard">MasterCard</option>
                          <option value="American Express">American Express</option>
                          <option value="UnionPay">UnionPay</option>
                          <option value="JCB">JCB</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="expiryDate">MM / AA</Label>
                        <Input type="text" id="expiryDate" placeholder="MM / AA" />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="cvc">CVC</Label>
                        <Input type="text" id="cvc" placeholder="CVC" />
                      </FormGroup>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Label for="cardholderName">Nom du titulaire de la carte</Label>
                  <Input type="text" id="cardholderName" placeholder="Nom complet" />
                </FormGroup>
                <FormGroup>
                  <Label for="country">Pays ou région</Label>
                  <Input type="text" id="country" defaultValue="Tunisie" />
                </FormGroup>
                <FormGroup check>
                  <Input type="checkbox" id="saveCard" />
                  <Label for="saveCard" check>
                    Enregistrer les informations de la carte pour le paiement en un clic
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for="phoneNumber">Numéro de téléphone (facultatif)</Label>
                  <Input type="text" id="phoneNumber" placeholder="20 123 456" />
                </FormGroup>
                <Button color="primary" className="mt-4">Enregistrer la carte</Button>
                <Button color="secondary" className="mt-2" onClick={() => setShowPaymentCard(false)}>
                  Retourner au plan
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default GestionAbonnement;
