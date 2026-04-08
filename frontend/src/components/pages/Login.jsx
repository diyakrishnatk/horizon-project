import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import loginImg from '../../assets/images/login.png';
import userIcon from '../../assets/images/user.png';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: ""
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    // Determine if the identifier is an email or a username
    const isEmail = credentials.identifier.includes('@');
    const loginData = {
      [isEmail ? 'email' : 'username']: credentials.identifier,
      password: credentials.password
    };

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData)
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Login failed");
        dispatch({ type: "LOGIN_FAILURE", payload: result.message });
        return;
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
      
      // Redirect based on role
      if (result.data.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
      alert(err.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="Login" />
              </div>
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="User" />
                </div>
                <h2>Login</h2>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Email or Username"
                      required
                      id="identifier"
                      value={credentials.identifier}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      value={credentials.password}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit">
                    Login
                  </Button>
                </Form>
                <p>
                  Don't have an account? <Link to="/register">Register Here!</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
