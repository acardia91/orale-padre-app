import { supabase } from './supabase';

export async function loadAllData() {
  try {
    var result = {};
    var { data: suppliers } = await supabase.from('suppliers').select('*');
    if (suppliers && suppliers.length > 0) {
      result.suppliers = suppliers.map(function(s) {
        return { id: s.id, name: s.name, locals: s.locals || ["San Luis","Los Remedios","Sevilla Este"], notes: s.notes || "", contact: s.contact || "", phone: s.phone || "", email: s.email || "", deliveryDays: s.delivery_days || "", minOrder: s.min_order || "", payTerms: s.pay_terms || "", discount: s.discount || "", rappel: s.rappel || "", commercialNotes: s.commercial_notes || "" };
      });
    }
    var { data: ingredients } = await supabase.from('ingredients').select('*');
    if (ingredients && ingredients.length > 0) {
      result.ingredients = ingredients.map(function(i) {
        return { id: i.id, name: i.name, supplierId: i.supplier_id, unit: i.unit, costPerUnit: parseFloat(i.cost_per_unit) || 0, category: i.category || "", lastAlbaranPrice: parseFloat(i.last_albaran_price) || 0, lastAlbaranDate: i.last_albaran_date || "" };
      });
    }
    var { data: recipes } = await supabase.from('recipes').select('*');
    var { data: recipeItems } = await supabase.from('recipe_items').select('*');
    if (recipes && recipes.length > 0) {
      var itemsByRecipe = {};
      if (recipeItems) { for (var ri = 0; ri < recipeItems.length; ri++) { var item = recipeItems[ri]; if (!itemsByRecipe[item.recipe_id]) itemsByRecipe[item.recipe_id] = []; itemsByRecipe[item.recipe_id].push({ type: item.item_type, refId: item.ref_id, qty: parseFloat(item.qty) || 0, id: item.id }); } }
      result.recipes = recipes.map(function(r) {
        return { id: r.id, name: r.name, type: r.type || "escandallo", yield: parseFloat(r.yield) || 1, yieldUnit: r.yield_unit || "raciones", notes: r.notes || "", items: itemsByRecipe[r.id] || [] };
      });
    }
    var { data: products } = await supabase.from('products').select('*');
    var { data: prices } = await supabase.from('product_prices').select('*');
    if (products && products.length > 0) {
      var pricesByProduct = {};
      if (prices) { for (var pi = 0; pi < prices.length; pi++) { var pr = prices[pi]; if (!pricesByProduct[pr.product_id]) pricesByProduct[pr.product_id] = {}; pricesByProduct[pr.product_id][pr.channel] = parseFloat(pr.price) || 0; } }
      result.products = products.map(function(p) {
        return { id: p.id, name: p.name, recipeId: p.recipe_id, category: p.category, prices: pricesByProduct[p.id] || { Sala: 0, "Uber Eats": 0, Glovo: 0, "Canal Propio": 0 }, active: p.active !== false, weekSales: p.week_sales || 0, packQty: p.pack_qty || 1 };
      });
    }
    var { data: promos } = await supabase.from('promotions').select('*');
    if (promos && promos.length > 0) {
      result.promotions = promos.map(function(p) {
        return { id: p.id, promo: p.promo_pct, products: p.products, usuarios: p.usuarios, local: p.local_name, dias: p.dias || [], plataforma: p.plataforma, estado: p.estado || "activa" };
      });
    }
    var { data: ideas } = await supabase.from('ideas').select('*');
    if (ideas && ideas.length > 0) {
      result.ideas = ideas.map(function(i) {
        return { id: i.id, title: i.title, desc: i.description || "", category: i.category || "nuevo producto", status: i.status || "idea", date: "", assignedTo: i.assigned_to || "", feedback: i.feedback || "" };
      });
    }
    var { data: stockAlerts } = await supabase.from('stock_alerts').select('*');
    if (stockAlerts) result.stockAlerts = stockAlerts;
    var { data: incidents } = await supabase.from('incidents').select('*');
    if (incidents) result.incidents = incidents;
    var { data: combos } = await supabase.from('saved_combos').select('*');
    if (combos && combos.length > 0) {
      result.savedCombos = combos.map(function(c) {
        return { id: c.id, name: c.name, channel: c.channel || "delivery", items: c.items || [], cost: parseFloat(c.cost) || 0, suggestedPrice: parseFloat(c.suggested_price) || 0, foodCostPct: parseFloat(c.food_cost_pct) || 0, status: c.status || "borrador" };
      });
    }
    var { data: mktTasks } = await supabase.from('mkt_tasks').select('*');
    var { data: mktCalendar } = await supabase.from('mkt_calendar').select('*');
    var { data: mktInfluencers } = await supabase.from('mkt_influencers').select('*');
    var { data: mktCatering } = await supabase.from('mkt_catering').select('*');
    var { data: mktActions } = await supabase.from('mkt_actions').select('*');
    var { data: mktDesigns } = await supabase.from('mkt_designs').select('*');
    var hasMkt = (mktTasks && mktTasks.length > 0) || (mktCalendar && mktCalendar.length > 0);
    if (hasMkt) {
      result.mktData = {
        tasks: (mktTasks || []).map(function(t) { return { id: t.id, title: t.title, assignedTo: t.assigned_to || "Maria", createdBy: t.created_by || "", priority: t.priority || "media", status: t.status || "pendiente", due: t.due_date || "", category: t.category || "contenido", notes: t.notes || "" }; }),
        calendar: (mktCalendar || []).map(function(c) { return { id: c.id, date: c.date || "", platform: c.platform || "instagram", type: c.type || "post", title: c.title || "", status: c.status || "idea", caption: c.caption || "" }; }),
        influencers: (mktInfluencers || []).map(function(i) { return { id: i.id, name: i.name || "", handle: i.handle || "", followers: i.followers || "", platform: i.platform || "instagram", status: i.status || "identificado", notes: i.notes || "", lastContact: i.last_contact || "" }; }),
        catering: (mktCatering || []).map(function(c) { return { id: c.id, name: c.name || "", type: c.type || "wedding_planner", contact: c.contact || "", platform: c.platform || "instagram", status: c.status || "por contactar", notes: c.notes || "", lastContact: c.last_contact || "" }; }),
        actions: (mktActions || []).map(function(a) { return { id: a.id, title: a.title || "", type: a.type || "calle", date: a.date || "", location: a.location || "", budget: a.budget || "", notes: a.notes || "", status: a.status || "planificada" }; }),
        designs: (mktDesigns || []).map(function(d) { return { id: d.id, title: d.title || "", type: d.type || "banner_ig", size: d.size || "", notes: d.notes || "", urgent: d.urgent || false, status: d.status || "pendiente", date: "" }; }),
      };
    }
    var { data: protocolos } = await supabase.from('protocolos').select('*');
    var { data: alertasProd } = await supabase.from('alertas_producto').select('*');
    var { data: planAccion } = await supabase.from('plan_accion').select('*');
    var { data: comunicados } = await supabase.from('comunicados').select('*');
    var { data: comReads } = await supabase.from('comunicados_read').select('*');
    var { data: clockRecs } = await supabase.from('clock_records').select('*').order('created_at', { ascending: false });
    var { data: checkRecs } = await supabase.from('checklist_records').select('*').order('created_at', { ascending: false });
    if (clockRecs && clockRecs.length > 0) result.clockRecords = clockRecs;
    if (checkRecs && checkRecs.length > 0) result.checklistRecords = checkRecs;
    var { data: albaranesRecs } = await supabase.from('albaranes').select('*').order('confirmed_at', { ascending: false });
    if (albaranesRecs && albaranesRecs.length > 0) {
      result.albaranes = albaranesRecs.map(function(a) {
        return { id: a.id, fecha: a.fecha, proveedor: a.proveedor, local: a.local, total: parseFloat(a.total) || 0, lineas: a.lineas || [], confirmedBy: a.confirmed_by, confirmedAt: a.confirmed_at };
      });
    }
    // Stock por local
    try { var { data: stockLocal } = await supabase.from('stock_local').select('*'); } catch(e) { var stockLocal = null; }
    if (stockLocal && stockLocal.length > 0) {
      result.stockData = {};
      for (var sli = 0; sli < stockLocal.length; sli++) {
        var sl = stockLocal[sli];
        if (!result.stockData[sl.local_name]) result.stockData[sl.local_name] = {};
        result.stockData[sl.local_name][sl.ingredient_id] = {
          qty: parseFloat(sl.qty) || 0,
          unit: sl.unit || "kg",
          lastUpdate: sl.last_update || "",
          lastAlbaran: sl.last_albaran_id || "",
          nombre: sl.ingredient_name || ""
        };
      }
    }
    // Gamification
    try { var { data: gamPoints } = await supabase.from('gamification_points').select('*'); } catch(e) { var gamPoints = null; }
    try { var { data: gamHistory } = await supabase.from('gamification_history').select('*').order('created_at', { ascending: false }); } catch(e) { var gamHistory = null; }
    if (gamPoints && gamPoints.length > 0) {
      result.gamification = {
        points: gamPoints.map(function(p) { return { userId: p.user_id, name: p.user_name, dorados: p.dorados || 0, totalPoints: p.total_points || 0 }; }),
        history: (gamHistory || []).map(function(h) { return { id: h.id, name: h.user_name, type: h.action_type, pts: h.points || 0, date: h.date || "", notes: h.notes || "" }; })
      };
    }
    // Week tasks
    try { var { data: wTasks } = await supabase.from('week_tasks').select('*'); } catch(e) { var wTasks = null; }
    if (wTasks && wTasks.length > 0) {
      result.weekTasks = wTasks.map(function(t) { return { id: t.id, title: t.title, assignedTo: t.assigned_to || "", status: t.status || "pendiente", priority: t.priority || "media", due: t.due_date || "", category: t.category || "general", notes: t.notes || "" }; });
    }
    // Price history
    try { var { data: pHistory } = await supabase.from('price_history').select('*').order('recorded_at', { ascending: false }).limit(200); } catch(e) { var pHistory = null; }
    if (pHistory && pHistory.length > 0) {
      result.priceHistory = pHistory.map(function(p) { return { id: p.id, ingredientId: p.ingredient_id, ingredientName: p.ingredient_name, oldPrice: parseFloat(p.old_price) || 0, newPrice: parseFloat(p.new_price) || 0, changePct: parseFloat(p.change_pct) || 0, source: p.source || "albaran", albaranId: p.albaran_id || "", proveedor: p.proveedor || "", local: p.local_name || "", date: p.recorded_at }; });
    }
    // Prep steps
    try { var { data: pSteps } = await supabase.from('prep_steps').select('*').order('step_order', { ascending: true }); } catch(e) { var pSteps = null; }
    if (pSteps && pSteps.length > 0) {
      result.prepSteps = {};
      for (var psi = 0; psi < pSteps.length; psi++) {
        var ps = pSteps[psi];
        if (!result.prepSteps[ps.recipe_id]) result.prepSteps[ps.recipe_id] = [];
        result.prepSteps[ps.recipe_id].push({ id: ps.id, order: ps.step_order, title: ps.title || "", description: ps.description || "", duration: ps.duration_min || 0, category: ps.category || "preparacion" });
      }
    }
    // App users
    try { var { data: appUsers } = await supabase.from('app_users').select('*').eq('active', true); } catch(e) { var appUsers = null; }
    if (appUsers && appUsers.length > 0) {
      result.appUsers = appUsers.map(function(u) { return { id: u.id, email: u.email || "", name: u.name, role: u.role, local: u.local_name || "", pin: u.pin || "", phone: u.phone || "", avatar: u.avatar_url || "" }; });
    }
    // Stock minimums
    try { var { data: stockMinsData } = await supabase.from('stock_minimums').select('*'); } catch(e) { var stockMinsData = null; }
    if (stockMinsData && stockMinsData.length > 0) {
      result.stockMins = {};
      for (var smi = 0; smi < stockMinsData.length; smi++) {
        var sm = stockMinsData[smi];
        result.stockMins[sm.ingredient_id + "_" + sm.local_name] = parseFloat(sm.min_qty) || 0;
      }
    }
    var hasOps = (protocolos && protocolos.length > 0) || (alertasProd && alertasProd.length > 0);
    if (hasOps) {
      var readMap = {};
      if (comReads) { for (var cr = 0; cr < comReads.length; cr++) { var r = comReads[cr]; if (!readMap[r.comunicado_id]) readMap[r.comunicado_id] = []; readMap[r.comunicado_id].push(r.user_name); } }
      result.opsData = {
        protocolos: (protocolos || []).map(function(p) { return { id: p.id, title: p.title, priority: p.priority || "media", category: p.category || "general", content: p.content || "", active: p.active !== false, date: "" }; }),
        alertasProducto: (alertasProd || []).map(function(a) { return { id: a.id, product: a.product, level: a.level, local: a.local_name || "Todos", notes: a.notes || "", actions: a.actions || "", date: "" }; }),
        planAccion: (planAccion || []).map(function(p) { return { id: p.id, action: p.action, responsible: p.responsible || "", deadline: p.deadline || "", status: p.status || "pendiente", priority: p.priority || "corto" }; }),
        comunicados: (comunicados || []).map(function(c) { return { id: c.id, title: c.title, content: c.content, author: c.author || "", date: "", readBy: readMap[c.id] || [] }; }),
      };
    }
    // Valoraciones
    try { var { data: valRows } = await supabase.from('valoraciones').select('*').eq('id', 'main').single(); } catch(e) { var valRows = null; }
    if (valRows) {
      if (!result.opsData) result.opsData = {};
      result.opsData.valoraciones = { locales: valRows.locales || {}, resenas: valRows.resenas || [] };
    }
    // Catering leads
    try { var { data: catLeads } = await supabase.from('catering_leads').select('*').order('created_at', { ascending: false }); } catch(e) { var catLeads = null; }
    if (catLeads && catLeads.length > 0) {
      result.cateringLeads = catLeads.map(function(l) { return { id: l.id, nombre: l.nombre, telefono: l.telefono || "", email: l.email || "", empresa: l.empresa || "", canal: l.canal || "Instagram", tipoEvento: l.tipo_evento || "Corporativo", fechaEvento: l.fecha_evento || "", personas: l.personas || "", modalidad: l.modalidad || "En Accion", proximaAccion: l.proxima_accion || "Llamar", fechaAccion: l.fecha_accion || "", notas: l.notas || "", estado: l.estado || "Nuevo", createdAt: l.created_at || "", timeline: l.timeline || [] }; });
    }
    // Catering presupuestos
    try { var { data: catPresu } = await supabase.from('catering_presupuestos').select('*').order('created_at', { ascending: false }); } catch(e) { var catPresu = null; }
    if (catPresu && catPresu.length > 0) {
      result.cateringPresupuestos = catPresu.map(function(p) { return { id: p.id, leadId: p.lead_id || "", tipo: p.tipo || "En Accion", producto: p.producto || "Completo", personas: p.personas || 50, extras: p.extras || [], transporte: p.transporte || false, precioPP: parseFloat(p.precio_pp) || 0, total: parseFloat(p.total) || 0, notas: p.notas || "", estado: p.estado || "borrador", createdAt: p.created_at || "", leadNombre: p.lead_nombre || "", clienteNombre: p.cliente_nombre || "", clienteEmail: p.cliente_email || "", clienteTel: p.cliente_tel || "", eventoFecha: p.evento_fecha || "", eventoDesc: p.evento_desc || "" }; });
    }
    // Cierres de caja
    try { var { data: cierresData } = await supabase.from('cierres_caja').select('*').order('fecha', { ascending: false }); } catch(e) { var cierresData = null; }
    if (cierresData && cierresData.length > 0) {
      result.cierresCaja = cierresData.map(function(c) { return { id: c.id, local: c.local_name, fecha: c.fecha, encargado: c.encargado || "", efectivo: parseFloat(c.efectivo) || 0, tarjeta: parseFloat(c.tarjeta) || 0, uberEats: parseFloat(c.uber_eats) || 0, glovo: parseFloat(c.glovo) || 0, canalPropio: parseFloat(c.canal_propio) || 0, total: parseFloat(c.total) || 0, observaciones: c.observaciones || "", createdAt: c.created_at || "" }; });
    }
    // Fraude registros
    try { var { data: fraudeRecs } = await supabase.from('fraude_registros').select('*').order('fecha', { ascending: false }); } catch(e) { var fraudeRecs = null; }
    if (fraudeRecs && fraudeRecs.length > 0) {
      result.fraudeData = fraudeRecs.map(function(f) { return { id: f.id, tipo: f.tipo, empleado: f.empleado || "", producto: f.producto || "", ticket: f.ticket || "", local: f.local_name || "", fecha: f.fecha || "", hora: f.hora || "", importe: parseFloat(f.importe) || 0, notas: f.notas || "", createdAt: f.created_at || "" }; });
    }
    return result;
  } catch (err) { console.error("Error loading from Supabase:", err); return null; }
}

export async function savePromotions(promos) {
  try { await supabase.from('promotions').delete().neq('id', ''); if (promos.length > 0) { await supabase.from('promotions').insert(promos.map(function(p) { return { id: p.id, promo_pct: p.promo, products: p.products, usuarios: p.usuarios, local_name: p.local, dias: p.dias, plataforma: p.plataforma, estado: p.estado }; })); } } catch (err) { console.error("Save promos error:", err); }
}
export async function saveStockAlerts(alerts) {
  try { await supabase.from('stock_alerts').delete().neq('id', ''); if (alerts.length > 0) { await supabase.from('stock_alerts').insert(alerts); } } catch (err) { console.error("Save stock error:", err); }
}
export async function saveIncidents(incidents) {
  try { await supabase.from('incidents').delete().neq('id', ''); if (incidents.length > 0) { await supabase.from('incidents').insert(incidents); } } catch (err) { console.error("Save incidents error:", err); }
}
export async function saveIdeas(ideas) {
  try { await supabase.from('ideas').delete().neq('id', ''); if (ideas.length > 0) { await supabase.from('ideas').insert(ideas.map(function(i) { return { id: i.id, title: i.title, description: i.desc, category: i.category, status: i.status, assigned_to: i.assignedTo, feedback: i.feedback }; })); } } catch (err) { console.error("Save ideas error:", err); }
}
export async function saveIngredients(ingredients) {
  try {
    if (!ingredients || ingredients.length === 0) return;
    for (var i = 0; i < ingredients.length; i++) {
      var ing = ingredients[i];
      await supabase.rpc('save_cost', { iid: ing.id, cost: parseFloat(ing.costPerUnit) || 0 });
    }
  } catch (err) { console.error("Save ingredients error:", err); }
}
export async function saveProducts(products) {
  try {
    if (!products || products.length === 0) return;
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var sala = p.prices ? parseFloat(p.prices.Sala) || 0 : 0;
      var uber = p.prices ? parseFloat(p.prices["Uber Eats"]) || 0 : 0;
      var glovo = p.prices ? parseFloat(p.prices.Glovo) || 0 : 0;
      var sales = parseInt(p.weekSales) || 0;
      await supabase.rpc('save_price', { pid: p.id, sala: sala, uber: uber, glovo: glovo, sales: sales });
    }
  } catch (err) { console.error("Save products error:", err); }
}
export async function saveOpsData(ops) {
  try {
    // Protocolos
    await supabase.from('protocolos').delete().neq('id', '');
    if (ops.protocolos && ops.protocolos.length > 0) {
      await supabase.from('protocolos').insert(ops.protocolos.map(function(p) { return { id: p.id, title: p.title, priority: p.priority, category: p.category, content: p.content, active: p.active !== false }; }));
    }
    // Alertas producto
    await supabase.from('alertas_producto').delete().neq('id', '');
    if (ops.alertasProducto && ops.alertasProducto.length > 0) {
      await supabase.from('alertas_producto').insert(ops.alertasProducto.map(function(a) { return { id: a.id, product: a.product, level: a.level, local_name: a.local || "Todos", notes: a.notes, actions: a.actions }; }));
    }
    // Plan accion
    await supabase.from('plan_accion').delete().neq('id', '');
    if (ops.planAccion && ops.planAccion.length > 0) {
      await supabase.from('plan_accion').insert(ops.planAccion.map(function(p) { return { id: p.id, action: p.action, responsible: p.responsible, deadline: p.deadline, status: p.status, priority: p.priority }; }));
    }
    // Comunicados
    await supabase.from('comunicados').delete().neq('id', '');
    if (ops.comunicados && ops.comunicados.length > 0) {
      await supabase.from('comunicados').insert(ops.comunicados.map(function(c) { return { id: c.id, title: c.title, content: c.content, author: c.author }; }));
    }
    // Comunicados read
    await supabase.from('comunicados_read').delete().neq('comunicado_id', '');
    var readRows = [];
    for (var ci = 0; ci < (ops.comunicados || []).length; ci++) {
      var com = ops.comunicados[ci];
      for (var ri = 0; ri < (com.readBy || []).length; ri++) {
        readRows.push({ comunicado_id: com.id, user_name: com.readBy[ri] });
      }
    }
    if (readRows.length > 0) { await supabase.from('comunicados_read').insert(readRows); }
    // Valoraciones
    if (ops.valoraciones) {
      await supabase.from('valoraciones').upsert({ id: 'main', locales: ops.valoraciones.locales || {}, resenas: ops.valoraciones.resenas || [], updated_at: new Date().toISOString() });
    }
  } catch (err) { console.error("Save ops error:", err); }
}
export async function saveMktData(mkt) {
  try {
    await supabase.from('mkt_tasks').delete().neq('id', '');
    if (mkt.tasks && mkt.tasks.length > 0) { await supabase.from('mkt_tasks').insert(mkt.tasks.map(function(t) { return { id: t.id, title: t.title, assigned_to: t.assignedTo, created_by: t.createdBy, priority: t.priority, status: t.status, due_date: t.due, category: t.category, notes: t.notes }; })); }
    await supabase.from('mkt_calendar').delete().neq('id', '');
    if (mkt.calendar && mkt.calendar.length > 0) { await supabase.from('mkt_calendar').insert(mkt.calendar.map(function(c) { return { id: c.id, date: c.date, platform: c.platform, type: c.type, title: c.title, status: c.status, caption: c.caption }; })); }
    await supabase.from('mkt_influencers').delete().neq('id', '');
    var vi = (mkt.influencers || []).filter(function(i) { return i.name; });
    if (vi.length > 0) { await supabase.from('mkt_influencers').insert(vi.map(function(i) { return { id: i.id, name: i.name, handle: i.handle, followers: i.followers, platform: i.platform, status: i.status, notes: i.notes, last_contact: i.lastContact }; })); }
    await supabase.from('mkt_catering').delete().neq('id', '');
    var vc = (mkt.catering || []).filter(function(c) { return c.name; });
    if (vc.length > 0) { await supabase.from('mkt_catering').insert(vc.map(function(c) { return { id: c.id, name: c.name, type: c.type, contact: c.contact, platform: c.platform, status: c.status, notes: c.notes, last_contact: c.lastContact }; })); }
    await supabase.from('mkt_actions').delete().neq('id', '');
    if (mkt.actions && mkt.actions.length > 0) { await supabase.from('mkt_actions').insert(mkt.actions.map(function(a) { return { id: a.id, title: a.title, type: a.type, date: a.date, location: a.location, budget: a.budget, notes: a.notes, status: a.status }; })); }
    await supabase.from('mkt_designs').delete().neq('id', '');
    if (mkt.designs && mkt.designs.length > 0) { await supabase.from('mkt_designs').insert(mkt.designs.map(function(d) { return { id: d.id, title: d.title, type: d.type, size: d.size, notes: d.notes, urgent: d.urgent, status: d.status }; })); }
  } catch (err) { console.error("Save mkt error:", err); }
}
export async function saveCombos(combos) {
  try {
    if (!combos || combos.length === 0) return;
    await supabase.rpc('clear_combos');
    await supabase.from('saved_combos').insert(combos.map(function(c) { return { id: c.id, name: c.name, channel: c.channel, items: c.items, cost: c.cost, suggested_price: c.suggestedPrice, food_cost_pct: c.foodCostPct, status: c.status }; }));
  } catch (err) { console.error("Save combos error:", err); }
}
export async function saveClockRecords(records) {
  try {
    await supabase.from('clock_records').delete().neq('id', '');
    if (records && records.length > 0) {
      await supabase.from('clock_records').insert(records.map(function(r) {
        return { id: r.id, user_name: r.user_name, user_role: r.user_role, type: r.type, local_name: r.local_name, latitude: r.latitude, longitude: r.longitude, distance_meters: r.distance_meters, is_valid: r.is_valid, notes: r.notes, created_at: r.created_at };
      }));
    }
  } catch (err) { console.error("Save clock records error:", err); }
}
export async function saveChecklistRecords(checklists) {
  try {
    await supabase.from('checklist_records').delete().neq('id', '');
    if (checklists && checklists.length > 0) {
      await supabase.from('checklist_records').insert(checklists.map(function(c) {
        return { id: c.id, type: c.type, local_name: c.local_name, completed_by: c.completed_by, items: c.items, all_completed: c.all_completed, notes: c.notes, created_at: c.created_at };
      }));
    }
  } catch (err) { console.error("Save checklist records error:", err); }
}
export async function saveAlbaranes(albaranes) {
  try {
    if (albaranes && albaranes.length > 0) {
      for (var i = 0; i < albaranes.length; i++) {
        var a = albaranes[i];
        await supabase.from('albaranes').upsert({
          id: a.id,
          fecha: a.fecha,
          proveedor: a.proveedor,
          local: a.local,
          total: a.total,
          lineas: a.lineas,
          confirmed_by: a.confirmedBy,
          confirmed_at: a.confirmedAt
        });
      }
    }
  } catch (err) { console.error("Save albaranes error:", err); }
}
export async function saveStockData(stockData) {
  try {
    var rows = [];
    var locals = Object.keys(stockData);
    for (var i = 0; i < locals.length; i++) {
      var locName = locals[i];
      var items = stockData[locName] || {};
      var keys = Object.keys(items);
      for (var j = 0; j < keys.length; j++) {
        var it = items[keys[j]];
        rows.push({
          local_name: locName,
          ingredient_id: keys[j],
          ingredient_name: it.nombre || "",
          qty: it.qty || 0,
          unit: it.unit || "kg",
          last_update: it.lastUpdate || "",
          last_albaran_id: it.lastAlbaran || "",
          updated_at: new Date().toISOString()
        });
      }
    }
    await supabase.from('stock_local').delete().neq('local_name', '');
    if (rows.length > 0) await supabase.from('stock_local').insert(rows);
  } catch (err) { console.error("Save stock error:", err); }
}

export async function saveGamification(gam) {
  try {
    if (!gam) return;
    // Save points
    await supabase.from('gamification_points').delete().neq('user_id', '');
    if (gam.points && gam.points.length > 0) {
      await supabase.from('gamification_points').insert(gam.points.map(function(p) {
        return { user_id: p.userId, user_name: p.name, dorados: p.dorados || 0, total_points: p.totalPoints || 0 };
      }));
    }
    // Save history (only recent, avoid duplicates)
    await supabase.from('gamification_history').delete().neq('id', '');
    if (gam.history && gam.history.length > 0) {
      await supabase.from('gamification_history').insert(gam.history.slice(0, 100).map(function(h) {
        return { id: h.id || ('gh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)), user_name: h.name, action_type: h.type, points: h.pts || 0, date: h.date || "", notes: h.notes || "" };
      }));
    }
  } catch (err) { console.error("Save gamification error:", err); }
}

export async function saveWeekTasks(tasks) {
  try {
    await supabase.from('week_tasks').delete().neq('id', '');
    if (tasks && tasks.length > 0) {
      await supabase.from('week_tasks').insert(tasks.map(function(t) {
        return { id: t.id, title: t.title, assigned_to: t.assignedTo || "", status: t.status || "pendiente", priority: t.priority || "media", due_date: t.due || "", category: t.category || "general", notes: t.notes || "" };
      }));
    }
  } catch (err) { console.error("Save week tasks error:", err); }
}

export async function savePriceHistory(entries) {
  try {
    // Only insert new entries (append-only, don't delete old)
    if (entries && entries.length > 0) {
      var newEntries = entries.filter(function(e) { return e.isNew; });
      if (newEntries.length > 0) {
        await supabase.from('price_history').insert(newEntries.map(function(p) {
          return { id: p.id, ingredient_id: p.ingredientId, ingredient_name: p.ingredientName, old_price: p.oldPrice, new_price: p.newPrice, change_pct: p.changePct, source: p.source || "albaran", albaran_id: p.albaranId || "", proveedor: p.proveedor || "", local_name: p.local || "" };
        }));
      }
    }
  } catch (err) { console.error("Save price history error:", err); }
}

export async function savePrepSteps(stepsMap) {
  // Prep steps are hardcoded in PREP_STEPS constant - skip save for now
  return;
}
export async function saveStockMins(mins) {
  try {
    if (!mins || typeof mins !== 'object') return;
    await supabase.from('stock_minimums').delete().neq('ingredient_id', '');
    var LOCS = ["San Luis","Los Remedios","Sevilla Este"];
    var rows = [];
    var keys = Object.keys(mins);
    for (var i = 0; i < keys.length; i++) {
      if (mins[keys[i]] <= 0) continue;
      // Key format: ingredientId_localName
      var loc = null;
      var ingId = null;
      for (var li = 0; li < LOCS.length; li++) {
        if (keys[i].endsWith("_" + LOCS[li])) {
          loc = LOCS[li];
          ingId = keys[i].substring(0, keys[i].length - loc.length - 1);
          break;
        }
      }
      if (loc && ingId) rows.push({ ingredient_id: ingId, local_name: loc, min_qty: mins[keys[i]] });
    }
    if (rows.length > 0) await supabase.from('stock_minimums').insert(rows);
  } catch (err) { console.error("Save stock mins error:", err); }
}
export async function saveCateringLeads(leads) {
  try {
    await supabase.from('catering_leads').delete().neq('id', '');
    if (leads && leads.length > 0) {
      await supabase.from('catering_leads').insert(leads.map(function(l) {
        return { id: l.id, nombre: l.nombre, telefono: l.telefono || "", email: l.email || "", empresa: l.empresa || "", canal: l.canal || "Instagram", tipo_evento: l.tipoEvento || "Corporativo", fecha_evento: l.fechaEvento || "", personas: l.personas || "", modalidad: l.modalidad || "En Accion", proxima_accion: l.proximaAccion || "Llamar", fecha_accion: l.fechaAccion || "", notas: l.notas || "", estado: l.estado || "Nuevo", created_at: l.createdAt || "", timeline: l.timeline || [] };
      }));
    }
  } catch (err) { console.error("Save catering leads error:", err); }
}
export async function saveCateringPresupuestos(presus) {
  try {
    await supabase.from('catering_presupuestos').delete().neq('id', '');
    if (presus && presus.length > 0) {
      await supabase.from('catering_presupuestos').insert(presus.map(function(p) {
        return { id: p.id, lead_id: p.leadId || "", tipo: p.tipo || "En Accion", producto: p.producto || "Completo", personas: p.personas || 50, extras: p.extras || [], transporte: p.transporte || false, precio_pp: p.precioPP || 0, total: p.total || 0, notas: p.notas || "", estado: p.estado || "borrador", created_at: p.createdAt || "", lead_nombre: p.leadNombre || "", cliente_nombre: p.clienteNombre || "", cliente_email: p.clienteEmail || "", cliente_tel: p.clienteTel || "", evento_fecha: p.eventoFecha || "", evento_desc: p.eventoDesc || "" };
      }));
    }
  } catch (err) { console.error("Save catering presupuestos error:", err); }
}
export async function saveCierresCaja(cierres) {
  try {
    await supabase.from('cierres_caja').delete().neq('id', '');
    if (cierres && cierres.length > 0) {
      await supabase.from('cierres_caja').insert(cierres.map(function(c) {
        return { id: c.id, local_name: c.local, fecha: c.fecha, encargado: c.encargado || "", efectivo: c.efectivo || 0, tarjeta: c.tarjeta || 0, uber_eats: c.uberEats || 0, glovo: c.glovo || 0, canal_propio: c.canalPropio || 0, total: c.total || 0, observaciones: c.observaciones || "", created_at: c.createdAt || "" };
      }));
    }
  } catch (err) { console.error("Save cierres error:", err); }
}
export async function saveFraudeData(fraude) {
  try {
    await supabase.from('fraude_registros').delete().neq('id', '');
    if (fraude && fraude.length > 0) {
      await supabase.from('fraude_registros').insert(fraude.map(function(f) {
        return { id: f.id, tipo: f.tipo, empleado: f.empleado || "", producto: f.producto || "", ticket: f.ticket || "", local_name: f.local || "", fecha: f.fecha || "", hora: f.hora || "", importe: f.importe || 0, notas: f.notas || "", created_at: f.createdAt || "" };
      }));
    }
  } catch (err) { console.error("Save fraude error:", err); }
}
export async function createProduct(recipe, items, product, prices) {
  try {
    await supabase.rpc('create_product', {
      p_recipe_id: recipe.id,
      p_recipe_name: recipe.name,
      p_recipe_notes: recipe.notes || '',
      p_items: JSON.stringify(items),
      p_product_id: product.id,
      p_product_name: product.name,
      p_category: product.category,
      p_pack_qty: product.packQty || 1,
      p_sala: prices.Sala || 0,
      p_uber: prices["Uber Eats"] || 0,
      p_glovo: prices.Glovo || 0,
      p_canal: prices["Canal Propio"] || 0,
      p_week_sales: product.weekSales || 0
    });
  } catch (err) { console.error("Create product error:", err); }
}

// === NOTIFICATIONS ===
export async function loadNotifications() {
  try {
    var { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    return (data || []).map(function(n) {
      return { id: n.id, type: n.type, title: n.title, detail: n.detail || "", targetPage: n.target_page || "", targetId: n.target_id || "", priority: n.priority || 2, createdBy: n.created_by || "", createdAt: n.created_at || "", targetRoles: n.target_roles || [], targetLocal: n.target_local || "", status: n.status || {}, resolvedAt: n.resolved_at || {} };
    });
  } catch (err) { console.error("Load notifications error:", err); return []; }
}

export async function addNotification(notif) {
  try {
    await supabase.from('notifications').insert({
      id: notif.id, type: notif.type, title: notif.title, detail: notif.detail || "", target_page: notif.targetPage || "", target_id: notif.targetId || "", priority: notif.priority || 2, created_by: notif.createdBy || "", created_at: notif.createdAt || new Date().toISOString(), target_roles: notif.targetRoles || [], target_local: notif.targetLocal || "", status: notif.status || {}, resolved_at: notif.resolvedAt || {}
    });
  } catch (err) { console.error("Add notification error:", err); }
}

export async function updateNotificationStatus(notifId, userName, newStatus) {
  try {
    var { data: existing } = await supabase.from('notifications').select('status, resolved_at').eq('id', notifId).single();
    if (!existing) return;
    var st = existing.status || {};
    var ra = existing.resolved_at || {};
    st[userName] = newStatus;
    if (newStatus === "resuelta") ra[userName] = new Date().toISOString();
    await supabase.from('notifications').update({ status: st, resolved_at: ra }).eq('id', notifId);
  } catch (err) { console.error("Update notification status error:", err); }
}

export async function deleteNotification(notifId) {
  try { await supabase.from('notifications').delete().eq('id', notifId); } catch (err) { console.error("Delete notification error:", err); }
}

export async function cleanOldNotifications() {
  try {
    var cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    var { data } = await supabase.from('notifications').select('id, status, resolved_at');
    if (!data) return;
    for (var i = 0; i < data.length; i++) {
      var n = data[i];
      var ra = n.resolved_at || {};
      var allResolved = Object.keys(ra).length > 0;
      var allOld = true;
      for (var k in ra) { if (ra[k] > cutoff) { allOld = false; break; } }
      if (allResolved && allOld) {
        await supabase.from('notifications').delete().eq('id', n.id);
      }
    }
  } catch (err) { console.error("Clean notifications error:", err); }
}

// === PIZARRA (BOARD) ===
export async function loadBoardItems() {
  try {
    var { data } = await supabase.from('board_items').select('*').eq('archived', false).order('created_at', { ascending: false });
    return (data || []).map(function(b) {
      return { id: b.id, local: b.local_name, section: b.section, content: b.content, status: b.status || "pendiente", createdBy: b.created_by || "", createdAt: b.created_at || "", completedBy: b.completed_by || "", completedAt: b.completed_at || "" };
    });
  } catch (err) { console.error("Load board error:", err); return []; }
}

export async function addBoardItem(item) {
  try {
    await supabase.from('board_items').insert({
      id: item.id, local_name: item.local, section: item.section, content: item.content, status: item.status || "pendiente", created_by: item.createdBy || "", created_at: item.createdAt || new Date().toISOString(), completed_by: "", completed_at: "", archived: false
    });
  } catch (err) { console.error("Add board item error:", err); }
}

export async function updateBoardItem(itemId, updates) {
  try {
    var dbUpdates = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.completedBy !== undefined) dbUpdates.completed_by = updates.completedBy;
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
    if (updates.archived !== undefined) dbUpdates.archived = updates.archived;
    await supabase.from('board_items').update(dbUpdates).eq('id', itemId);
  } catch (err) { console.error("Update board item error:", err); }
}

export async function deleteBoardItem(itemId) {
  try { await supabase.from('board_items').delete().eq('id', itemId); } catch (err) { console.error("Delete board item error:", err); }
}

export async function archiveDailyBoard(localName) {
  try {
    var today = new Date().toISOString().slice(0, 10);
    await supabase.from('board_items').update({ archived: true }).in('section', ['preparaciones', 'super']).eq('local_name', localName).lt('created_at', today + 'T00:00:00');
  } catch (err) { console.error("Archive board error:", err); }
}

export async function loadCleaningLog() {
  try {
    var { data } = await supabase.from('cleaning_log').select('*').order('cleaned_at', { ascending: false });
    return (data || []).map(function(c) {
      return { id: c.id, local: c.local_name, zone: c.zone, cleanedBy: c.cleaned_by || "", cleanedAt: c.cleaned_at || "" };
    });
  } catch (err) { console.error("Load cleaning error:", err); return []; }
}

export async function addCleaningEntry(entry) {
  try {
    await supabase.from('cleaning_log').insert({
      id: entry.id, local_name: entry.local, zone: entry.zone, cleaned_by: entry.cleanedBy || "", cleaned_at: entry.cleanedAt || new Date().toISOString()
    });
  } catch (err) { console.error("Add cleaning error:", err); }
}

// === PROJECTS & TASKS ===
export async function loadProjects() {
  try {
    var { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    return (data || []).map(function(p) {
      return { id: p.id, name: p.name, description: p.description || "", status: p.status || "activo", lead: p.lead || "", color: p.color || "#B45309", createdBy: p.created_by || "", createdAt: p.created_at || "" };
    });
  } catch (err) { console.error("Load projects error:", err); return []; }
}

export async function saveProject(project) {
  try {
    await supabase.from('projects').upsert({
      id: project.id, name: project.name, description: project.description || "", status: project.status || "activo", lead: project.lead || "", color: project.color || "#B45309", created_by: project.createdBy || "", created_at: project.createdAt || new Date().toISOString()
    });
  } catch (err) { console.error("Save project error:", err); }
}

export async function deleteProject(projectId) {
  try {
    await supabase.from('project_comments').delete().in('task_id', (await supabase.from('project_tasks').select('id').eq('project_id', projectId)).data.map(function(t) { return t.id; }));
    await supabase.from('project_tasks').delete().eq('project_id', projectId);
    await supabase.from('projects').delete().eq('id', projectId);
  } catch (err) { console.error("Delete project error:", err); }
}

export async function loadProjectTasks(projectId) {
  try {
    var { data } = await supabase.from('project_tasks').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    return (data || []).map(function(t) {
      return { id: t.id, projectId: t.project_id, title: t.title, description: t.description || "", status: t.status || "por_hacer", assignedTo: t.assigned_to || [], priority: t.priority || "media", deadline: t.deadline || "", createdBy: t.created_by || "", createdAt: t.created_at || "", completedAt: t.completed_at || "" };
    });
  } catch (err) { console.error("Load tasks error:", err); return []; }
}

export async function saveProjectTask(task) {
  try {
    await supabase.from('project_tasks').upsert({
      id: task.id, project_id: task.projectId, title: task.title, description: task.description || "", status: task.status || "por_hacer", assigned_to: task.assignedTo || [], priority: task.priority || "media", deadline: task.deadline || "", created_by: task.createdBy || "", created_at: task.createdAt || new Date().toISOString(), completed_at: task.completedAt || ""
    });
  } catch (err) { console.error("Save task error:", err); }
}

export async function deleteProjectTask(taskId) {
  try {
    await supabase.from('project_comments').delete().eq('task_id', taskId);
    await supabase.from('project_tasks').delete().eq('id', taskId);
  } catch (err) { console.error("Delete task error:", err); }
}

export async function loadTaskComments(taskId) {
  try {
    var { data } = await supabase.from('project_comments').select('*').eq('task_id', taskId).order('created_at', { ascending: true });
    return (data || []).map(function(c) {
      return { id: c.id, taskId: c.task_id, author: c.author || "", text: c.text, createdAt: c.created_at || "" };
    });
  } catch (err) { console.error("Load comments error:", err); return []; }
}

export async function addTaskComment(comment) {
  try {
    await supabase.from('project_comments').insert({
      id: comment.id, task_id: comment.taskId, author: comment.author || "", text: comment.text, created_at: comment.createdAt || new Date().toISOString()
    });
  } catch (err) { console.error("Add comment error:", err); }
}

export async function loadAllProjectTasks() {
  try {
    var { data } = await supabase.from('project_tasks').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).map(function(t) {
      return { id: t.id, projectId: t.project_id, title: t.title, status: t.status || "por_hacer", assignedTo: t.assigned_to || [], priority: t.priority || "media", deadline: t.deadline || "", createdBy: t.created_by || "", createdAt: t.created_at || "", completedAt: t.completed_at || "" };
    });
  } catch (err) { console.error("Load all tasks error:", err); return []; }
}
