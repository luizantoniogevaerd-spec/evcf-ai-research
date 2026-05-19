export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    nome, email, empresa, perfil,
    estagio_fundo, tamanho_cheque,
    estagio_startup, vertical, ja_captou,
  } = req.body;

  const fields = {
    'Nome': nome,
    'Email': email,
    'Empresa': empresa,
    'Perfil': perfil,
  };

  if (estagio_fundo)  fields['Estágio do Fundo']    = estagio_fundo;
  if (tamanho_cheque) fields['Tamanho de Cheque']    = tamanho_cheque;
  if (estagio_startup) fields['Estágio da Startup']  = estagio_startup;
  if (vertical)       fields['Vertical da Startup']  = vertical;
  if (ja_captou !== undefined) fields['Já captou?']  = ja_captou === 'sim';

  try {
    const resp = await fetch('https://api.airtable.com/v0/appW8MfWZOuhZGOPA/Leads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
