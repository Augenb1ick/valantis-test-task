import md5 from 'md5';

export const generateXAuthHeader = (password: string) => {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const authString = `${password}_${timestamp}`;
    const xAuth = md5(authString);

    return { 'X-Auth': xAuth };
};
