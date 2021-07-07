import './login.view.css';
import axios from 'axios';

export default function Login() {

    async function login() {
        const response = await axios.get('http://192.168.100.4:3000/api/auth/login');
        console.log(response);
        window.location = response.data.body;
    }

    return (
        <main className="form-signin">
            <form>
                <img className="mb-4" src="https://play-lh.googleusercontent.com/CiGs15N1e1tXrSnVLEY9jOnKi1oNzPQNRjqhR8fXE0pnu_bRyNmfc8xXr2VQUJTfJ9A" alt="" width="72" height="57" />
                <button className="w-100 btn btn-lg btn-primary" type="button" onClick={login}>Sign in</button>
            </form>
        </main>
    );
}