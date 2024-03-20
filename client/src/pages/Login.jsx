import logo from "../assets/logo.png";
import "./login.css";
function Login() {
  return (
    <main className="main-login">
      <section className="text">
        <img src={logo} alt="logo" width="250px" />
        <p>
          Univ Learn is your passport to a world of transformative learning
          experiences. Whether you&apos;re a student, educator, or institution,
          our platform offers dynamic courses, collaborative tools, and seamless
          administration for an enriched learning journey. Join us today and
          embark on a journey of discovery, innovation, and lifelong learning
          with Univ Learn.
        </p>
      </section>
      <section className="form-section">
        <form>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="password" />
          <button className="login-btn">Login</button>
          <a className="forget-pass" href="#">
            Forgot password?
          </a>
          <div className="line"></div>
          <button className="sign-up-btn">Sign Up</button>
        </form>
      </section>
    </main>
  );
}

export default Login;
