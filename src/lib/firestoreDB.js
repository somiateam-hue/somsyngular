import { supabase } from './supabase';

// ── Helpers ────────────────────────────────────────────────────────────────

async function uploadBase64(base64, path) {
  const blob = await fetch(base64).then(r => r.blob());
  const ext  = blob.type.split('/')[1] || 'jpg';
  const filePath = `${path}.${ext}`;
  const { error } = await supabase.storage.from('portafolio').upload(filePath, blob, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('portafolio').getPublicUrl(filePath);
  return data.publicUrl;
}

// ── LEADS ──────────────────────────────────────────────────────────────────

export async function addLead(lead) {
  const { error } = await supabase.from('leads').insert({
    nombre:    lead.nombre,
    name:      lead.nombre,   // columna original de la tabla
    email:     lead.email,
    empresa:   lead.empresa,
    proceso:   lead.proceso,
    message:   lead.proceso,  // columna original de la tabla
    timestamp: lead.timestamp,
    done:      false,
  });
  if (error) throw error;
}

export function subscribeLeads(callback) {
  const fetchAll = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('createdAt', { ascending: false });
    callback(data || []);
  };
  fetchAll();

  const channel = supabase.channel('leads_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchAll)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function toggleLeadDone(id, current) {
  await supabase.from('leads').update({ done: !current }).eq('id', id);
}

export async function deleteLead(id) {
  await supabase.from('leads').delete().eq('id', id);
}

// ── MEETINGS ───────────────────────────────────────────────────────────────

export async function addMeeting(meeting) {
  const { error } = await supabase.from('meetings').insert({
    name:    meeting.name,
    email:   meeting.email,
    message: meeting.details,   // la tabla usa "message" en lugar de "details"
    date:    meeting.date,
    time:    meeting.time,
    status:  'pending',
  });
  if (error) throw error;
}

export function subscribeMeetings(callback) {
  const fetchAll = async () => {
    const { data } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });
    // normalizar "message" → "details" para el componente
    callback((data || []).map(m => ({ ...m, details: m.message })));
  };
  fetchAll();

  const channel = supabase.channel('meetings_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, fetchAll)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function updateMeetingStatus(id, newStatus) {
  await supabase.from('meetings').update({ status: newStatus }).eq('id', id);
}

// ── CHATS ──────────────────────────────────────────────────────────────────

export async function saveChat(sessionId, startTime, messages) {
  if (!messages.some(m => m.role === 'user')) return;
  await supabase.from('chats').upsert({
    id:        sessionId,
    startTime,
    messages,
    updatedAt: new Date().toISOString(),
  });
}

export function subscribeChats(callback) {
  const fetchAll = async () => {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .order('updatedAt', { ascending: false });
    callback(data || []);
  };
  fetchAll();

  const channel = supabase.channel('chats_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, fetchAll)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// ── PORTFOLIO ──────────────────────────────────────────────────────────────

export async function addPortfolioItem(item) {
  let src       = item.src;
  let thumbnail = item.thumbnail;

  try {
    if (src?.startsWith('data:')) {
      src = await uploadBase64(src, `items/${Date.now()}_src`);
    }
  } catch (e) { console.warn('Storage falló:', e); }

  try {
    if (thumbnail?.startsWith('data:')) {
      thumbnail = await uploadBase64(thumbnail, `items/${Date.now()}_thumb`);
    }
  } catch (e) { console.warn('Storage falló:', e); }

  await supabase.from('portfolio').insert({
    title:       item.title,
    description: item.desc,      // la tabla usa "description"
    category:    item.type,      // la tabla usa "category"
    src,
    thumbnail:   thumbnail || '',
  });
}

export function subscribePortfolio(callback) {
  const fetchAll = async () => {
    const { data } = await supabase
      .from('portfolio')
      .select('*')
      .order('createdAt', { ascending: false });
    // normalizar "description" → "desc" y "category" → "type" para los componentes
    callback((data || []).map(p => ({ ...p, desc: p.description, type: p.category })));
  };
  fetchAll();

  const channel = supabase.channel('portfolio_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, fetchAll)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function deletePortfolioItem(id) {
  await supabase.from('portfolio').delete().eq('id', id);
}

export async function updatePortfolioItem(id, fields) {
  await supabase.from('portfolio').update(fields).eq('id', id);
}

// ── CONTENT / CMS ─────────────────────────────────────────────────────────

export async function saveContentToFirestore(content) {
  await supabase.from('config').upsert({ key: 'content', value: content });
}

export async function loadContentFromFirestore() {
  const { data } = await supabase
    .from('config')
    .select('value')
    .eq('key', 'content')
    .single();
  return data?.value || null;
}
