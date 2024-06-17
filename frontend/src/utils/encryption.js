import crypto from 'crypto';

export const generatekeypair = () => {
    // Generate RSA key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    return { publicKey, privateKey };
};

export const encryptpayload = (payload, publicKey) => {
    // Convert the payload to a string
    const textToEncrypt = JSON.stringify(payload);

    // Generate a random AES key and IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt the text with AES
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'base64');
    encryptedText += cipher.final('base64');

    // Encrypt the AES key with RSA
    const encryptedKey = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, aesKey);

    // Format data to store as a string
    const dataToStore = `${iv.toString('base64')}$${encryptedKey.toString('base64')}$${encryptedText}`;

    // Return the encrypted data
    return dataToStore;
};

export const decryptpayload = (encryptedData, privateKey) => {
    // Read the encrypted data components
    const [ivBase64, encryptedKeyBase64, encryptedText] = encryptedData.split('$');
    const iv = Buffer.from(ivBase64, 'base64');
    const encryptedKey = Buffer.from(encryptedKeyBase64, 'base64');

    // Decrypt the AES key with RSA
    const decryptedKey = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, encryptedKey);

    // Decrypt the text with AES
    const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedKey, iv);
    let decryptedText = decipher.update(encryptedText, 'base64', 'utf8');
    decryptedText += decipher.final('utf8');

    // Parse the decrypted text back to a JSON object
    return JSON.parse(decryptedText);
};
