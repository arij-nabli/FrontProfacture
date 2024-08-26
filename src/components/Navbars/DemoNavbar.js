import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Headroom from "headroom.js";
import {
  Button,
  UncontrolledCollapse,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  Navbar,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link as ScrollLink } from 'react-scroll';

class DemoNavbar extends React.Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();
  }

  state = {
    collapseClasses: "",
    collapseOpen: false,
  };

  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out",
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: "",
    });
  };

  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/landing-page" tag={RouterLink}>
                <img
                  style={{ width: "200px", height: "auto" }}
                  alt="Logo ProFacture"
                  src={require("assets/img/brand/logo-ProFacture.png")}
                />
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="9">
                      <RouterLink to="/">
                        <img
                          alt="Logo ProFacture"
                          src={require("assets/img/brand/logo-ProFacture.png")}
                          style={{ width: "200px", height: "auto" }}
                        />
                      </RouterLink>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav className="navbar-nav-hover align-items-lg-center text-dark">
                  <NavItem>
                    <ScrollLink
                      to="services"
                      smooth={true}
                      duration={500}
                      className="nav-link"
                      offset={-70}  // Ajustez l'offset selon la hauteur de la barre de navigation
                    >
                     Services 
                    </ScrollLink>
                  </NavItem>
                  <NavItem>
                    <ScrollLink
                      to="contact"
                      smooth={true}
                      duration={500}
                      className="nav-link"
                      offset={-70}  // Ajustez l'offset selon la hauteur de la barre de navigation
                    >
                      Contactez-nous
                    </ScrollLink>
                  </NavItem>
                  <NavItem>
                    <RouterLink className="nav-link" to="/blogs">
                      Blogs
                    </RouterLink>
                  </NavItem>
                </Nav>
                <Nav className="align-items-lg-center ml-lg-auto text-dark">
                  <NavItem>
                    <RouterLink className="nav-link" to="/login-page">
                      Se connecter
                    </RouterLink>
                  </NavItem>
                  <NavItem>
                    <Button
                      className="btn btn-primary"
                      color="primary"
                      tag={RouterLink}
                      to="/register-page"
                      style={{ backgroundColor: "#5e72e4", borderColor: "#5e72e4" }}
                    >
                      Créer un compte
                    </Button>
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default DemoNavbar;
