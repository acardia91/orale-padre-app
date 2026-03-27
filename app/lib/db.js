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
        return { id: i.id, name: i.name, supplierId: i.supplier_id, unit: i.unit, costPerUnit: parseFloat(i.cost_per_unit) || 0, category: i.category || "" };
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
  try { await supabase.from('ingredients').delete().neq('id', ''); if (ingredients.length > 0) { await supabase.from('ingredients').insert(ingredients.map(function(i) { return { id: i.id, name: i.name, supplier_id: i.supplierId, unit: i.unit, cost_per_unit: i.costPerUnit, category: i.category }; })); } } catch (err) { console.error("Save ingredients error:", err); }
}
export async function saveProducts(products) {
  try { await supabase.from('product_prices').delete().neq('id', ''); await supabase.from('products').delete().neq('id', ''); if (products.length > 0) { await supabase.from('products').insert(products.map(function(p) { return { id: p.id, name: p.name, recipe_id: p.recipeId, category: p.category, active: p.active, week_sales: p.weekSales, pack_qty: p.packQty || 1 }; })); var allPrices = []; for (var i = 0; i < products.length; i++) { var p = products[i]; if (p.prices) { var channels = Object.keys(p.prices); for (var j = 0; j < channels.length; j++) { allPrices.push({ product_id: p.id, channel: channels[j], price: p.prices[channels[j]] || 0 }); } } } if (allPrices.length > 0) { await supabase.from('product_prices').insert(allPrices); } } } catch (err) { console.error("Save products error:", err); }
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
