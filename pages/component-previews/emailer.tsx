import { EmailerRequestBody } from 'pages/api/emailer';
import { useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';

function EmailForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');
    const [port, setPort] = useState(993);
    const [recipient, setRecipient] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const body: EmailerRequestBody = {
            email,
            password,
            server,
            port,
            recipient,
            content,
        };
        const res = await nextFetch('emailer', {
            method: 'POST',
            body,
        });
        console.log({ res });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            <h3>
                To use Gmail, you might need to enable{' '}
                <a href="https://www.google.com/settings/security/lesssecureapps">{`"Less secure app access"`} </a>
            </h3>
            <label htmlFor="email">Email:</label>
            <br />
            <input
                type="text"
                id="email"
                name="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
            />
            <br />
            <label htmlFor="password">Password:</label>
            <br />
            <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
            />
            <br />
            <label htmlFor="server">IMAP Server:</label>
            <br />
            <input
                type="text"
                id="server"
                name="server"
                required
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="imap.example.com"
            />
            <br />
            <label htmlFor="port">Port:</label>
            <br />
            <input
                type="number"
                id="port"
                name="port"
                value={port}
                onChange={(e) => setPort(Number.parseInt(e.target.value))}
                placeholder="Your port (default 993)"
            />
            <br />
            <label htmlFor="recipient">Email recipient:</label>
            <br />
            <input
                type="text"
                id="recipient"
                name="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="friend@example.com"
            />
            <br />

            <label htmlFor="content">Email content:</label>
            <br />
            <input
                type="text"
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hi how are you?"
            />
            <br />

            <input type="submit" value="Submit" />
        </form>
    );
}

export default EmailForm;
