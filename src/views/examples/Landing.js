/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import { AiOutlineToTop } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaFileAlt, FaCheckCircle, FaInfinity, FaHeadset } from 'react-icons/fa';
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Download from "../IndexSections/Download.js";

class Landing extends React.Component {
  state = {};
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            
            
            </section>
        
          </div>
        
     <section className="section section-lg">
  <Container>
    <Row className="row-grid align-items-center">
      <Col className="order-md-2" md="6">
        <img
          alt="Illustration de Profacture"
          className="img-fluid floating"
          src={require("assets/img/brand/ProFac.png")}
          style={{ width: '900px', height: 'auto' }}  // Ajustez la largeur et la hauteur
        />
      </Col>
      <Col className="order-md-1" md="6">
        <div className="pr-md-5">
          <h1 className="display-1">Simplifiez l'extraction de vos données</h1>
          <p className="lead text-italic">
            Profacture utilise l'intelligence artificielle pour automatiser
            l'extraction des données de vos chèques et factures, vous permettant
            ainsi de gagner du temps et d'améliorer l'exactitude de vos
            informations. Découvrez comment notre solution moderne peut
            transformer la gestion de vos documents financiers.
          </p>
          <Button
            className="btn btn-primary mt-4"
            color="primary"
            tag={Link}
            to="/register-page"
            style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
          >
            Essayez Gratuitement
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
</section>

  {/* Section des Services */}
  <section className="section section-lg" id="services">
    <Container>
      <Row className="row-grid align-items-center">
        <Col className="order-lg-1" lg="12">
          {/* Service 1: Extraction Automatisée */}
          <Card className="card-lift--hover shadow border-0 mt-5">
            <CardBody className="py-5 text-center">
              <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                <i className="fa-solid fa-magnifying-glass" />
                <AiOutlineToTop />
                {/* Icône de téléchargement */}
              </div>
              <h6 className="text-primary text-uppercase">
                Extraction Automatisée
              </h6>
              <p className="description mt-3">
                Téléchargez vos fichiers PDF, JPG ou IMG et laissez notre IA extraire les informations essentielles.
              </p>
              <ul className="list-unstyled mt-3">
                <li><i className="ni ni-check-bold text-primary" /> Extraction rapide et précise</li>
                <li><i className="ni ni-check-bold text-primary" /> Support pour plusieurs formats de fichiers</li>
                <li><i className="ni ni-check-bold text-primary" /> Traitement en temps réel</li>
              </ul>
              <div>
                <Badge color="primary" pill className="mr-1">
                  Extraction
                </Badge>
                <Badge color="primary" pill className="mr-1">
                  Automatique
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Service 2: Correction Manuelle */}
          <Card className="card-lift--hover shadow border-0 mt-5">
            <CardBody className="py-5 text-center">
              <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                <i className="ni ni-settings text-success" /> {/* Icône de réglage */}
              </div>
              <h6 className="text-success text-uppercase">
                Correction Manuelle
              </h6>
              <p className="description mt-3">
                Ajustez facilement les données extraites pour une précision optimale.
              </p>
              <ul className="list-unstyled mt-3">
                <li><i className="ni ni-check-bold text-success" /> Interface utilisateur intuitive pour la correction</li>
                <li><i className="ni ni-check-bold text-success" /> Révision et validation des données extraites</li>
                <li><i className="ni ni-check-bold text-success" /> Historique des modifications</li>
              </ul>
              <div>
                <Badge color="success" pill className="mr-1">
                  Correction
                </Badge>
                <Badge color="success" pill className="mr-1">
                  Manuelle
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Service 3: Organisation Structurée */}
          <Card className="card-lift--hover shadow border-0 mt-5">
            <CardBody className="py-5 text-center">
              <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                <i className="ni ni-grid-45 text-warning" /> 
                <AiFillCheckCircle /> {/* Icône de grille */}
              </div>
              <h6 className="text-warning text-uppercase">
                Organisation Structurée
              </h6>
              <p className="description mt-3">
                Organisez vos fichiers selon divers critères et exportez-les en fichiers Excel.
              </p>
              <ul className="list-unstyled mt-3">
                <li><i className="ni ni-check-bold text-warning" /> Classement par date, client, et matricule fiscal</li>
                <li><i className="ni ni-check-bold text-warning" /> Options flexibles pour l'exportation en Excel</li>
                <li><i className="ni ni-check-bold text-warning" /> Fonction de recherche avancée</li>
              </ul>
              <div>
                <Badge color="warning" pill className="mr-1">
                  Organisation
                </Badge>
                <Badge color="warning" pill className="mr-1">
                  Structuré
                </Badge>
                <Badge color="warning" pill className="mr-1">
                  Export
                </Badge>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>

  {/* Section des Tarifs */}
  <section className="section-lg bg-secondary">
    <Container>
      <Row className="text-center">
        <Col lg="12">
          <h2 className="display-3">Nos Tarifs</h2>
          <p className="lead text-muted">
            Choisissez le plan qui vous convient le mieux.
          </p>
        </Col>
      </Row>
      <Row className="row-grid align-items-center">
        <Col md="4">
          <Card className="card-pricing border-0 mb-5 mb-lg-0">
            <CardBody className="py-5 text-center">
              <h6 className="text-primary text-uppercase">Mensuel</h6>
              <h1 className="display-2">
                30<span className="text-muted"> TND</span> le mois
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li><FaInfinity /> Extraction illimitée</li>
                <li><FaHeadset /> Support Prioritaire</li>
              </ul>
              <Button
                className="btn btn-primary mt-4"
                color="primary"
                tag={Link}
                to="/register-page"
                style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
              >
                S'inscrire
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="card-pricing border-0 mb-5 mb-lg-0">
            <CardBody className="py-5 text-center">
              <h6 className="text-primary text-uppercase">Semestriel</h6>
              <h1 className="display-2">
                25<span className="text-muted"> TND</span> /mois
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li><FaInfinity /> Extraction illimitée</li>
                <li><FaHeadset /> Support Prioritaire</li>
              </ul>
              <Button
                className="btn btn-primary mt-4"
                color="primary"
                tag={Link}
                to="/register-page"
                style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
              >
                S'inscrire
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="card-pricing border-0 mb-5 mb-lg-0">
            <CardBody className="py-5 text-center">
              <h6 className="text-primary text-uppercase">Annuel</h6>
              <h1 className="display-2">
                20<span className="text-muted"> TND</span> /mois
              </h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li><FaInfinity /> Extraction illimitée</li>
                <li><FaHeadset /> Support Prioritaire</li>
              </ul>
              <Button
                className="btn btn-primary mt-4"
                color="primary"
                tag={Link}
                to="/register-page"
                style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
              >
                S'inscrire
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>

  {/* Section Comment Ça Marche */}
  <section className="section section-lg">
    <Container>
      <Row className="text-center">
        <Col lg="12">
          <h2 className="display-3">Comment Ça Marche</h2>
          <p className="lead text-muted">Simplifiez l'extraction de vos données en 4 étapes faciles</p>
        </Col>
      </Row>
      <Row className="row-grid mt-5">
        <Col md="3">
          <div className="icon icon-lg icon-shape icon-shape-primary shadow rounded-circle mb-4">
            <i className="fa-solid fa-file-upload" />
          </div>
          <h5 className="text-primary">Téléchargement</h5>
          <p className="description">Téléchargez vos fichiers PDF, JPG ou IMG.</p>
        </Col>
        <Col md="3">
          <div className="icon icon-lg icon-shape icon-shape-success shadow rounded-circle mb-4">
            <i className="fa-solid fa-search" />
          </div>
          <h5 className="text-success">Extraction</h5>
          <p className="description">Notre IA extrait les informations essentielles.</p>
        </Col>
        <Col md="3">
          <div className="icon icon-lg icon-shape icon-shape-warning shadow rounded-circle mb-4">
            <i className="fa-solid fa-edit" />
          </div>
          <h5 className="text-warning">Correction</h5>
          <p className="description">Ajustez facilement les données extraites.</p>
        </Col>
        <Col md="3">
          <div className="icon icon-lg icon-shape icon-shape-info shadow rounded-circle mb-4">
            <i className="fa-solid fa-folder-open" />
          </div>
          <h5 className="text-info">Organisation</h5>
          <p className="description">Organisez et exportez vos fichiers en Excel.</p>
        </Col>
      </Row>
    </Container>
  </section>

  {/* Section Contact */}
  <section className="section section-lg" id="contact">
    <Container>
      <Row className="justify-content-center ">
        <Col lg="8">
          <Card className="bg-gradient-secondary shadow">
            <CardBody className="">
              <h4 className="mb-1">Contactez-nous</h4>
              <p className="mt-0">
                N'hésitez pas à nous contacter pour toute question ou demande d'information.
              </p>
              <FormGroup
                className={classnames("mt-5", {
                  focused: this.state.nameFocused,
                })}
              >
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-user-run" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Votre nom"
                    type="text"
                    onFocus={(e) =>
                      this.setState({ nameFocused: true })
                    }
                    onBlur={(e) =>
                      this.setState({ nameFocused: false })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup
                className={classnames({
                  focused: this.state.emailFocused,
                })}
              >
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Adresse email"
                    type="email"
                    onFocus={(e) =>
                      this.setState({ emailFocused: true })
                    }
                    onBlur={(e) =>
                      this.setState({ emailFocused: false })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-4">
                <Input
                  className="form-control-alternative"
                  cols="80"
                  name="message"
                  placeholder="Tapez un message..."
                  rows="4"
                  type="textarea"
                />
              </FormGroup>
              <div>
                <Button
                  block
                  className="btn-round"
                  color="default"
                  size="lg"
                  type="button"
                >
                  Envoyer le message
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  

</section>

        </main>
        <CardsFooter />
      </>
    );
  }
}

export default Landing;
