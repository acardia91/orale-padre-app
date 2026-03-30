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
    await supabase.from('ingredients').delete().neq('id', '___');
    await supabase.from('ingredients').insert(ingredients.map(function(i) { return { id: i.id, name: i.name, supplier_id: i.supplierId, unit: i.unit, cost_per_unit: i.costPerUnit, category: i.category }; }));
  } catch (err) { console.error("Save ingredients error:", err); }
}
export async function saveProducts(products) {
  try {
    if (!products || products.length === 0) return;
    await supabase.from('product_prices').delete().neq('product_id', '___');
    await supabase.from('products').delete().neq('id', '___');
    await supabase.from('products').insert(products.map(function(p) { return { id: p.id, name: p.name, recipe_id: p.recipeId, category: p.category, active: p.active, week_sales: p.weekSales, pack_qty: p.packQty || 1 }; }));
    var allPrices = [];
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      if (p.prices) {
        var channels = Object.keys(p.prices);
        for (var j = 0; j < channels.length; j++) {
          allPrices.push({ product_id: p.id, channel: channels[j], price: p.prices[channels[j]] || 0 });
        }
      }
    }
    if (allPrices.length > 0) await supabase.from('product_prices').insert(allPrices);
  } catch (err) { console.error("Save products error:", err); }
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
    for (var i = 0; i < combos.length; i++) {
      var c = combos[i];
      await supabase.from('saved_combos').upsert({ id: c.id, name: c.name, channel: c.channel, items: c.items, cost: c.cost, suggested_price: c.suggestedPrice, food_cost_pct: c.foodCostPct, status: c.status }, { onConflict: 'id' });
    }
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
