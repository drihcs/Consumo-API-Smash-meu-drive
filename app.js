const su = new SmashUploader({
  region: "us-east-1",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI1MWJmNTRkLTc3ZjktNGU4OC1hYzNmLTcwZjNkYmQ1YTdmNi1ldSIsInVzZXJuYW1lIjoiYTk4MTIzYmEtOTdjYS00OTE2LWIwN2QtYjM1MWEwYWFmZmY1IiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxNzcuMzcuMTM2Ljk1Iiwic2NvcGUiOiJOb25lIiwiYWNjb3VudCI6ImM4Zjk0ZjNiLTI4NWYtNGQ2Yy1iYTA5LTdlYTkwMTQzNDgxYS1lYSIsImlhdCI6MTc0NjQzNTIyMCwiZXhwIjo0OTAyMTk1MjIwfQ.hILwfE6Xz90J5VBWOP33I3edqSS5DqXJyLRgH6wVDT8"
});

const uploadFile = async (file) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB em bytes
  if (file.size > MAX_SIZE) {
    alert('O arquivo excede o tamanho máximo de 5MB.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Envio do arquivo para a API Smash
    const response = await fetch('https://api.smash.com/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${su.token}`, // Usando o token de autenticação para a Smash API
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar o arquivo');
    }

    const data = await response.json();

    // O link de download da API será retornado aqui
    const smashLink = data.link;
    const customLink = smashLink.replace('https://fromsmash.com/', 'https://mh-nuvem0729.fromsmash.com/');

    console.log(`Arquivo enviado com sucesso! Link para download: ${customLink}`);
    return customLink;

  } catch (error) {
    console.error('Erro ao fazer o upload:', error);
  }
};
