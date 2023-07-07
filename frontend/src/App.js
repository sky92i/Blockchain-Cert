import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { HomePage } from "./pages/home-page";
import { VerifyPage } from "./pages/verify-page";
import { AddDocumentPage } from "./pages/add-document-page";
import { DocumentPage } from "./pages/document-page";
import { DocumentsListPage } from "./pages/documents-list-page";
import { MyDocumentsListPage } from "./pages/my-documents-list-page";
import { CallbackPage } from "./pages/callback-page";
import { ProfilePage } from "./pages/profile-page";
import { AuthenticationGuard } from "./components/authentication-guard";
import { PageLoader } from "./components/page-loader";
import { Navbar, Container, Nav } from "react-bootstrap";

export const App = () => {
  const [isAdmin, setAdmin] = useState(false);
  const { isAuthenticated, user, isLoading, logout, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getAdmin = async () => {
      const token = await getAccessTokenSilently();
      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      const decodedJwt = parseJwt(token);

      //console.log(decodedJwt.permissions);
      if (decodedJwt.permissions[0] === "read:admin-messages") {
        setAdmin(true);
      }
    };

    if (isAuthenticated) {
      getAdmin();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to={"/verify"} className="nav-link">
                Verify
              </Link>
              {isAuthenticated && (
                <Link to={"/user-docs"} className="nav-link">
                  My Documents
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link to={"/docs"} className="nav-link">
                  Manage Documents
                </Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link to={"/add"} className="nav-link">
                  Add Documents
                </Link>
              )}
            </Nav>

            {isAuthenticated ? (
              <Nav className="ml-auto">
                <Link to={"/profile"} className="m-1 nav-link">
                  {user.email}
                </Link>
                <button type="button" className="m-1 btn btn-outline-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </Nav>
            ) : (
              <Nav className="ml-auto">
                <button type="button" className="m-1 btn btn-outline-secondary" onClick={handleLogin}>
                  Login
                </button>
                <button type="button" className="m-1 btn btn-outline-secondary" onClick={handleSignUp}>
                  Sign Up
                </button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-3">
        <Routes>
          <Route
            path="/"
            element={<HomePage />} />
          <Route
            path="/home"
            element={<HomePage />} />
          <Route
            path="/profile"
            element={<AuthenticationGuard component={ProfilePage} />}
          />
          <Route
            path="/verify"
            element={<VerifyPage />}
          />
          <Route
            path="/docs"
            element={<AuthenticationGuard component={DocumentsListPage} />}
          />
          <Route
            path="/user-docs"
            element={<AuthenticationGuard component={MyDocumentsListPage} />}
          />
          <Route
            path="/add"
            element={<AuthenticationGuard component={AddDocumentPage} />}
          />
          <Route
            path="/docs/:id"
            element={<AuthenticationGuard component={DocumentPage} />}
          />
          <Route
            path="/callback"
            element={<CallbackPage />}
          />
        </Routes>
      </div>
    </div>
  );
};
