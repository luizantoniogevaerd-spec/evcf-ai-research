module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    nome, email, empresa, perfil,
    estagio_fundo, tamanho_cheque,
    estagio_startup, vertical, ja_captou,
  } = req.body || {};

  if (!nome || !email || !empresa || !perfil) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const fields = {
    'Nome': nome,
    'Email': email,
    'Empresa': empresa,
    'Perfil': perfil,
  };

  if (estagio_fundo)   fields['Estágio do Fundo']   = estagio_fundo;
  if (tamanho_cheque)  fields['Tamanho do Cheque']   = tamanho_cheque;
  if (estagio_startup) fields['Estágio da Startup']  = estagio_startup;
  if (vertical)        fields['Vertical da Startup'] = vertical;
  if (ja_captou !== undefined && ja_captou !== '') {
    fields['Já captou?'] = ja_captou === 'sim' || ja_captou === true;
  }

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return res.status(500).json({ error: 'AIRTABLE_TOKEN não configurado' });

  try {
    const resp = await fetch('https://api.airtable.com/v0/appW8MfWZOuhZGOPA/Leads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error('Airtable error:', JSON.stringify(data));
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
