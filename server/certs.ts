import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';

export async function getCertificate() {
    const certPath = path.join(__dirname, 'server.cert');
    const keyPath = path.join(__dirname, 'server.key');

    // Check if certs exist, if not generate them
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        console.log('Generating self-signed certificates...');
        const attrs = [{ name: 'commonName', value: 'localhost' }];
        const pems = await selfsigned.generate(attrs, { days: 365 });

        fs.writeFileSync(certPath, pems.cert);
        fs.writeFileSync(keyPath, pems.private);

        return {
            cert: pems.cert,
            key: pems.private
        };
    }

    return {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath)
    };
}
