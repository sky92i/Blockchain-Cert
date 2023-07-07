import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";

export const ProfilePage = () => {
  //const [accessToken, setAccessToken] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    /*const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently();
      setAccessToken(accessToken);
    };*/

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

      if (decodedJwt.permissions[0] === "read:admin-messages") {
        setAdmin(true);
      }
    };

    if (isAuthenticated) {
      //getAccessToken();
      getAdmin();
    }

  }, [isAuthenticated, getAccessTokenSilently]);

  if (!user) {
    return null;
  }

  return (
    <div className="card">
      <div>
        <header>
          <h4>Your Profile</h4>
        </header>
        <hr></hr>
        <p>
          <strong>Username:</strong>{" "}
          {user.nickname}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>
        <p>
          <strong>Verified Email:</strong>{" "}
          {user.email_verified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Admin Role:</strong>{" "}
          {isAdmin ? "Yes" : "No"}
        </p>
        <p>
          <strong>Account Information Last Updated at:</strong>{" "}
          {user.updated_at}
        </p>
        {/*<p>
          <strong>Access Token (For Debug):</strong>{" "}
          {accessToken}
  </p>*/}
      </div>
    </div>
  );
};
