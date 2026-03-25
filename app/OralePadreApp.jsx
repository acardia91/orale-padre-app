"use client";
import { useState } from "react";

var LOCALS = ["San Luis", "Los Remedios", "Sevilla Este"];
var CHANNELS = ["Sala", "Uber Eats", "Glovo", "Canal Propio"];
var ING_CATS = ["Proteinas", "Verduras", "Lacteos", "Salsas", "Cereales", "Bebidas", "Envases", "Otros"];
var PROD_CATS = ["Burritos", "Bowls", "Tacos", "Quesadillas", "Nachos", "Extras", "Bebidas", "Postres"];
var uid = function() { return Math.random().toString(36).slice(2) + Date.now().toString(36); };
var fmt = function(n) { return (n == null || isNaN(n)) ? "-" : n.toFixed(2) + " E"; };
var fPct = function(n) { return (n == null || isNaN(n)) ? "-" : n.toFixed(1) + "%"; };

function makeSeed() {
  var ig = function(ref, g) { return { type: "ingredient", refId: ref, qty: g / 1000, id: uid() }; };
  var iu = function(ref, u) { return { type: "ingredient", refId: ref, qty: u, id: uid() }; };
  var suppliers = [
    { id: "s-r2r", name: "R2R", locals: LOCALS, notes: "Tortillas, totopos, queso nachos, pulled pork BBQ, bacon, frijoles, salsa verde, nata agria, alitas BBQ, chipotle", contact: "Rafael", phone: "654 111 222", email: "pedidos@r2r.es", deliveryDays: "Lunes, Miercoles, Viernes", minOrder: "150 E", payTerms: "30 dias", discount: "5% en pedidos +500E", rappel: "2% anual si superas 15.000E", commercialNotes: "Proveedor principal. Buen servicio. Revisar precios cada trimestre." },
    { id: "s-toca", name: "Tocawey", locals: LOCALS, notes: "Cochinita, butter chicken, pollo pastor (10.19/kg caja), salsa BKK, chutney", contact: "David", phone: "654 333 444", email: "info@tocawey.com", deliveryDays: "Martes, Jueves", minOrder: "100 E (caja 10uds)", payTerms: "Contado", discount: "Precio fijo por caja", rappel: "-", commercialNotes: "Productos exclusivos. Calidad constante. Congelados." },
    { id: "s-atl", name: "Atlanta", locals: LOCALS, notes: "Heura vegano 43.45/kg, pollo braseado 15.73/kg", contact: "Marta", phone: "654 555 666", email: "marta@atlanta.es", deliveryDays: "Lunes, Jueves", minOrder: "80 E", payTerms: "15 dias", discount: "-", rappel: "-", commercialNotes: "ALERTA: Heura muy caro. Negociar o buscar alternativa vegana." },
    { id: "s-carn", name: "Carniceria", locals: LOCALS, notes: "Pechuga 7.80/kg, picada cerdo 4.80/kg, carrillada 8.90/kg", contact: "Antonio", phone: "654 777 888", email: "", deliveryDays: "Diario (pedido antes 10am)", minOrder: "Sin minimo", payTerms: "Semanal", discount: "Precio de mercado variable", rappel: "-", commercialNotes: "Proveedor local de confianza. Precios fluctuan con mercado." },
    { id: "s-frut", name: "Fruteria", locals: LOCALS, notes: "Aguacate, cebolla, cilantro, lima, tomate, lechuga, patatas", contact: "Jose", phone: "654 999 000", email: "", deliveryDays: "Diario", minOrder: "Sin minimo", payTerms: "Semanal", discount: "-", rappel: "-", commercialNotes: "Producto fresco diario. Precios estacionales." },
    { id: "s-ldom", name: "Lacteos Dominguez", locals: LOCALS, notes: "Mayo Hellmanns 5L, aceite girasol 10L", contact: "Carmen", phone: "654 112 233", email: "pedidos@lactdom.es", deliveryDays: "Martes, Viernes", minOrder: "100 E", payTerms: "30 dias", discount: "3% pronto pago", rappel: "-", commercialNotes: "Fiable. Entregas puntuales." },
    { id: "s-nero", name: "Neron Hosteleria", locals: LOCALS, notes: "Envases, aluminio, tapas, servilletas, tarrinas, limpieza", contact: "Pablo", phone: "654 445 566", email: "neron@neron.es", deliveryDays: "Miercoles", minOrder: "200 E", payTerms: "30 dias", discount: "Descuento por volumen", rappel: "3% anual", commercialNotes: "Pedido mensual grande. Revisar alternativas de envases." },
    { id: "s-nomen", name: "Nomen Food", locals: LOCALS, notes: "Arroz Bayo 1.20/kg", contact: "Distribuidor", phone: "900 123 456", email: "", deliveryDays: "Bajo pedido", minOrder: "50kg", payTerms: "Contado", discount: "-", rappel: "-", commercialNotes: "Arroz base. Buen precio." },
    { id: "s-keiko", name: "Keiko Bebidas", locals: LOCALS, notes: "Modelo, Coronita, Desperados, Coca-Cola, Fanta, Aquarius, agua", contact: "Keiko", phone: "654 778 899", email: "keiko@keikobebidas.es", deliveryDays: "Lunes, Jueves", minOrder: "150 E", payTerms: "15 dias", discount: "Rappel trimestral", rappel: "5% si superas 3.000E/trimestre", commercialNotes: "Buen servicio. Pedir stock extra para fines de semana." },
    { id: "s-hisp", name: "Hispalense", locals: LOCALS, notes: "Barriles cerveza, Cruzcampo, Heineken 0.0", contact: "Comercial zona", phone: "654 001 122", email: "", deliveryDays: "Miercoles", minOrder: "1 barril", payTerms: "30 dias", discount: "Precio fijo contrato", rappel: "-", commercialNotes: "Contrato anual. Revisar en renovacion." },
    { id: "s-albi", name: "Ana Albi", locals: LOCALS, notes: "Helados Kinder/Pistacho/Lotus 1.90/ud", contact: "Ana", phone: "654 334 455", email: "", deliveryDays: "Martes", minOrder: "30 uds", payTerms: "Contado", discount: "-", rappel: "-", commercialNotes: "Postres. Buen margen." },
    { id: "s-hielo", name: "Hielosmar", locals: LOCALS, notes: "Sacos hielo 3.18", contact: "Repartidor", phone: "654 556 677", email: "", deliveryDays: "Diario en verano, 3/sem resto", minOrder: "5 sacos", payTerms: "Contado", discount: "-", rappel: "-", commercialNotes: "Aumentar pedidos en verano." },
    { id: "s-incov", name: "Incovel", locals: LOCALS, notes: "Bolsas kraft 0.32/ud", contact: "Comercial", phone: "654 889 900", email: "info@incovel.es", deliveryDays: "Bajo pedido", minOrder: "500 uds", payTerms: "30 dias", discount: "10% +2000uds", rappel: "-", commercialNotes: "Bolsas delivery. Pedir en lotes grandes." },
  ];
  var ingredients = [
    { id:"i01",name:"Pollo pechuga",supplierId:"s-carn",unit:"kg",costPerUnit:7.80,category:"Proteinas" },
    { id:"i02",name:"Pollo Braseado",supplierId:"s-atl",unit:"kg",costPerUnit:15.73,category:"Proteinas" },
    { id:"i03",name:"Pollo al Pastor",supplierId:"s-toca",unit:"kg",costPerUnit:10.19,category:"Proteinas" },
    { id:"i04",name:"Cochinita Pibil",supplierId:"s-toca",unit:"kg",costPerUnit:10.19,category:"Proteinas" },
    { id:"i05",name:"Pulled Pork BBQ",supplierId:"s-r2r",unit:"kg",costPerUnit:8.77,category:"Proteinas" },
    { id:"i06",name:"Carrillada Cerdo",supplierId:"s-carn",unit:"kg",costPerUnit:8.90,category:"Proteinas" },
    { id:"i07",name:"Carne Picada",supplierId:"s-carn",unit:"kg",costPerUnit:4.80,category:"Proteinas" },
    { id:"i08",name:"Butter Chicken",supplierId:"s-toca",unit:"kg",costPerUnit:10.19,category:"Proteinas" },
    { id:"i09",name:"Alitas Pollo BBQ",supplierId:"s-r2r",unit:"kg",costPerUnit:8.23,category:"Proteinas" },
    { id:"i10",name:"Alitas racion 5uds",supplierId:"s-r2r",unit:"ud",costPerUnit:0.24,category:"Proteinas" },
    { id:"i11",name:"Bacon topping",supplierId:"s-r2r",unit:"kg",costPerUnit:5.27,category:"Proteinas" },
    { id:"i12",name:"Heura Vegano",supplierId:"s-atl",unit:"kg",costPerUnit:43.45,category:"Proteinas" },
    { id:"i20",name:"Lechuga",supplierId:"s-frut",unit:"kg",costPerUnit:2.00,category:"Verduras" },
    { id:"i21",name:"Cebolla Roja",supplierId:"s-frut",unit:"kg",costPerUnit:1.40,category:"Verduras" },
    { id:"i22",name:"Pina",supplierId:"s-frut",unit:"kg",costPerUnit:3.60,category:"Verduras" },
    { id:"i23",name:"Patatas",supplierId:"s-frut",unit:"kg",costPerUnit:1.40,category:"Verduras" },
    { id:"i24",name:"Patatas Paja",supplierId:"s-frut",unit:"kg",costPerUnit:1.80,category:"Verduras" },
    { id:"i30",name:"Pico Gallo",supplierId:"s-frut",unit:"kg",costPerUnit:2.00,category:"Salsas" },
    { id:"i31",name:"Guacamole",supplierId:"s-frut",unit:"kg",costPerUnit:5.00,category:"Salsas" },
    { id:"i32",name:"Pico Gallo Pina",supplierId:"s-frut",unit:"kg",costPerUnit:2.00,category:"Salsas" },
    { id:"i33",name:"Salsa Verde",supplierId:"s-r2r",unit:"kg",costPerUnit:3.59,category:"Salsas" },
    { id:"i34",name:"Chipotle Molido",supplierId:"s-r2r",unit:"kg",costPerUnit:10.91,category:"Salsas" },
    { id:"i35",name:"Nata Agria",supplierId:"s-r2r",unit:"kg",costPerUnit:5.63,category:"Salsas" },
    { id:"i36",name:"Mayo Coco",supplierId:"s-ldom",unit:"kg",costPerUnit:3.62,category:"Salsas" },
    { id:"i37",name:"Mayo Lima",supplierId:"s-ldom",unit:"kg",costPerUnit:3.62,category:"Salsas" },
    { id:"i38",name:"Salsa Lima",supplierId:"s-ldom",unit:"kg",costPerUnit:3.62,category:"Salsas" },
    { id:"i39",name:"Salsa BKK Hannibal",supplierId:"s-toca",unit:"kg",costPerUnit:7.90,category:"Salsas" },
    { id:"i40",name:"Chutney Tomate",supplierId:"s-toca",unit:"kg",costPerUnit:7.45,category:"Salsas" },
    { id:"i41",name:"Salsa Ranchera",supplierId:"s-r2r",unit:"kg",costPerUnit:5.62,category:"Salsas" },
    { id:"i42",name:"Encurtida",supplierId:"s-frut",unit:"kg",costPerUnit:1.43,category:"Salsas" },
    { id:"i43",name:"Esquites Maiz",supplierId:"s-frut",unit:"kg",costPerUnit:2.17,category:"Salsas" },
    { id:"i50",name:"Queso Mix Nachos",supplierId:"s-r2r",unit:"kg",costPerUnit:6.48,category:"Lacteos" },
    { id:"i51",name:"Salsa Cheddar USA",supplierId:"s-r2r",unit:"kg",costPerUnit:15.28,category:"Lacteos" },
    { id:"i52",name:"4 Quesos mezcla",supplierId:"s-r2r",unit:"kg",costPerUnit:6.48,category:"Lacteos" },
    { id:"i53",name:"Frijoles Negros",supplierId:"s-r2r",unit:"kg",costPerUnit:3.13,category:"Cereales" },
    { id:"i60",name:"Arroz Largo Bayo",supplierId:"s-nomen",unit:"kg",costPerUnit:1.20,category:"Cereales" },
    { id:"i61",name:"Tortilla Burrito 30cm",supplierId:"s-r2r",unit:"ud",costPerUnit:0.23,category:"Cereales" },
    { id:"i62",name:"Tortita Taco 12cm",supplierId:"s-r2r",unit:"ud",costPerUnit:0.06,category:"Cereales" },
    { id:"i63",name:"Totopos Nachos",supplierId:"s-r2r",unit:"kg",costPerUnit:4.17,category:"Cereales" },
    { id:"i64",name:"Risketos",supplierId:"s-r2r",unit:"kg",costPerUnit:2.00,category:"Cereales" },
    { id:"i70",name:"Pegatina",supplierId:"s-nero",unit:"ud",costPerUnit:0.02,category:"Envases" },
    { id:"i71",name:"Papel Albal",supplierId:"s-nero",unit:"ud",costPerUnit:0.03,category:"Envases" },
    { id:"i72",name:"Papel Antigrasa",supplierId:"s-nero",unit:"ud",costPerUnit:0.03,category:"Envases" },
    { id:"i73",name:"Envase Tapa Bowl",supplierId:"s-nero",unit:"ud",costPerUnit:0.22,category:"Envases" },
    { id:"i74",name:"Envase Tapa Entrante",supplierId:"s-nero",unit:"ud",costPerUnit:0.14,category:"Envases" },
  ];
  var recipes = [
    { id:"rb01",name:"Esc Dona Juana Vegano",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"430g ALERTA Heura 43.45/kg",items:[ig("i60",70),ig("i12",110),ig("i53",40),ig("i30",35),ig("i31",35),ig("i20",35),ig("i33",15),iu("i61",1)] },
    { id:"rb02",name:"Esc Dona Dolores",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"475g",items:[ig("i60",70),ig("i34",25),ig("i07",110),ig("i53",40),ig("i51",20),ig("i30",35),ig("i31",35),ig("i20",35),ig("i33",15),iu("i61",1)] },
    { id:"rb03",name:"Esc Don Juarez",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"485g",items:[ig("i60",70),ig("i35",60),ig("i05",120),ig("i30",40),ig("i31",40),ig("i63",30),ig("i20",35),iu("i61",1)] },
    { id:"rb04",name:"Esc Lady Cochinita",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"500g",items:[ig("i60",70),ig("i34",25),ig("i04",110),ig("i53",40),ig("i32",70),ig("i31",40),ig("i20",35),ig("i35",20),iu("i61",1)] },
    { id:"rb05",name:"Esc Pollo Padre",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"462g",items:[ig("i60",70),ig("i36",30),ig("i01",110),ig("i51",20),ig("i42",7),ig("i43",60),ig("i64",15),ig("i20",35),ig("i35",25),iu("i61",1)] },
    { id:"rb06",name:"Esc Don Hampi Butter",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"485g",items:[ig("i60",70),ig("i36",30),ig("i08",120),ig("i30",40),ig("i31",40),ig("i63",30),ig("i20",35),iu("i61",1)] },
    { id:"rb07",name:"Esc Black Chancho",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"430g",items:[ig("i60",70),ig("i38",30),ig("i06",110),ig("i30",45),ig("i42",10),ig("i24",50),ig("i33",25),iu("i61",1)] },
    { id:"rb08",name:"Esc Don Brasa",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"435g",items:[ig("i60",70),ig("i39",50),ig("i02",110),ig("i30",40),ig("i53",40),ig("i31",40),ig("i35",30),ig("i20",35),iu("i61",1)] },
    { id:"rb09",name:"Esc Pollo Pastor",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"495g",items:[ig("i60",70),ig("i33",15),ig("i03",120),ig("i30",40),ig("i53",30),ig("i31",40),ig("i63",30),ig("i50",40),ig("i35",20),iu("i61",1)] },
    { id:"rn01",name:"Esc Nude P.Braseado",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"445g",items:[ig("i60",150),ig("i39",25),ig("i02",100),ig("i31",40),ig("i30",40),ig("i53",45),ig("i20",20),ig("i35",25)] },
    { id:"rn02",name:"Esc Nude Dolores",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"445g",items:[ig("i60",150),ig("i34",25),ig("i07",100),ig("i53",45),ig("i30",40),ig("i31",40),ig("i51",25),ig("i33",25),ig("i20",20)] },
    { id:"rn03",name:"Esc Nude Cochinita",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"470g",items:[ig("i60",150),ig("i34",25),ig("i04",100),ig("i31",40),ig("i30",40),ig("i53",45),ig("i20",20),ig("i22",25),ig("i35",25)] },
    { id:"rn04",name:"Esc Nude Juarez",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"395g",items:[ig("i60",150),ig("i35",25),ig("i05",100),ig("i30",40),ig("i31",40),ig("i63",20),ig("i20",20)] },
    { id:"rn05",name:"Esc Nude Chancho",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"420g",items:[ig("i60",150),ig("i37",25),ig("i06",100),ig("i21",20),ig("i30",40),ig("i24",60),ig("i33",25)] },
    { id:"rn06",name:"Esc Nude Vegano",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"420g ALERTA Heura",items:[ig("i60",150),ig("i33",25),ig("i12",100),ig("i53",45),ig("i30",40),ig("i31",40),ig("i20",20)] },
    { id:"rt01",name:"Esc Taco Carrillada x1",type:"escandallo",yield:1,yieldUnit:"uds",notes:"85g",items:[ig("i06",60),ig("i50",10),ig("i21",15),iu("i62",1)] },
    { id:"rt02",name:"Esc Taco Cochinita x1",type:"escandallo",yield:1,yieldUnit:"uds",notes:"90g",items:[ig("i04",60),ig("i50",10),ig("i31",20),iu("i62",1)] },
    { id:"rt03",name:"Esc Taco Pulled Pork x1",type:"escandallo",yield:1,yieldUnit:"uds",notes:"100g",items:[ig("i05",60),ig("i50",10),ig("i31",20),iu("i62",1)] },
    { id:"rt04",name:"Esc Taco Pollo Pastor x1",type:"escandallo",yield:1,yieldUnit:"uds",notes:"90g",items:[ig("i03",60),ig("i21",10),ig("i34",10),iu("i62",1)] },
    { id:"rt05",name:"Esc Taco Buffalo x1",type:"escandallo",yield:1,yieldUnit:"uds",notes:"95g",items:[ig("i09",60),ig("i40",10),ig("i21",15),ig("i50",10),iu("i62",1)] },
    { id:"rq01",name:"Esc Quesadilla Pulled Pork",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"190g",items:[ig("i05",100),ig("i52",90),iu("i61",1)] },
    { id:"rq02",name:"Esc Quesadilla Butter Chicken",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"190g",items:[ig("i08",100),ig("i52",90),iu("i61",1)] },
    { id:"re01",name:"Esc Nachos Guadalupe",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"545g",items:[ig("i63",175),ig("i05",70),ig("i51",30),ig("i50",150),ig("i30",40),ig("i31",40),ig("i35",40)] },
    { id:"re02",name:"Esc Nachos Cienfuegos",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"575g",items:[ig("i63",175),ig("i07",50),ig("i53",50),ig("i51",30),ig("i50",150),ig("i30",40),ig("i31",40),ig("i35",40)] },
    { id:"re03",name:"Esc Bacon Cheese Fries",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"555g",items:[ig("i23",310),ig("i41",130),ig("i11",25),ig("i50",90)] },
    { id:"re04",name:"Esc Alitas Padre",type:"escandallo",yield:1,yieldUnit:"raciones",notes:"200g",items:[iu("i10",5),ig("i40",30),ig("i63",15),ig("i37",10)] },
  ];
  var products = [
    { id:"pb01",name:"Dona Juana Vegano",recipeId:"rb01",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:12 },
    { id:"pb02",name:"Dona Dolores",recipeId:"rb02",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:65 },
    { id:"pb03",name:"Don Juarez",recipeId:"rb03",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:55 },
    { id:"pb04",name:"Lady Cochinita",recipeId:"rb04",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:48 },
    { id:"pb05",name:"Pollo Padre",recipeId:"rb05",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:42 },
    { id:"pb06",name:"Don Hampi Butter",recipeId:"rb06",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:30 },
    { id:"pb07",name:"Black Chancho",recipeId:"rb07",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:50 },
    { id:"pb08",name:"Don Brasa",recipeId:"rb08",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:35 },
    { id:"pb09",name:"Pollo Pastor",recipeId:"rb09",category:"Burritos",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:58 },
    { id:"pn01",name:"Nude P.Braseado",recipeId:"rn01",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:25 },
    { id:"pn02",name:"Nude Dolores",recipeId:"rn02",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:20 },
    { id:"pn03",name:"Nude Cochinita",recipeId:"rn03",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:22 },
    { id:"pn04",name:"Nude Juarez",recipeId:"rn04",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:18 },
    { id:"pn05",name:"Nude Chancho",recipeId:"rn05",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:15 },
    { id:"pn06",name:"Nude Vegano",recipeId:"rn06",category:"Bowls",prices:{Sala:9.90,"Uber Eats":10.90,Glovo:10.90,"Canal Propio":0},active:true,weekSales:8 },
    { id:"pt01",name:"Tacos Carrillada x3",recipeId:"rt01",category:"Tacos",prices:{Sala:9.90,"Uber Eats":9.90,Glovo:9.90,"Canal Propio":0},active:true,weekSales:30,packQty:3 },
    { id:"pt02",name:"Tacos Cochinita x3",recipeId:"rt02",category:"Tacos",prices:{Sala:9.90,"Uber Eats":9.90,Glovo:9.90,"Canal Propio":0},active:true,weekSales:25,packQty:3 },
    { id:"pt03",name:"Tacos Pulled Pork x3",recipeId:"rt03",category:"Tacos",prices:{Sala:9.90,"Uber Eats":9.90,Glovo:9.90,"Canal Propio":0},active:true,weekSales:20,packQty:3 },
    { id:"pt04",name:"Tacos Pollo Pastor x3",recipeId:"rt04",category:"Tacos",prices:{Sala:9.90,"Uber Eats":9.90,Glovo:9.90,"Canal Propio":0},active:true,weekSales:23,packQty:3 },
    { id:"pt05",name:"Tacos Buffalo x3",recipeId:"rt05",category:"Tacos",prices:{Sala:9.90,"Uber Eats":9.90,Glovo:9.90,"Canal Propio":0},active:true,weekSales:8,packQty:3 },
    { id:"pq01",name:"Quesadilla Pulled Pork",recipeId:"rq01",category:"Quesadillas",prices:{Sala:8.95,"Uber Eats":8.95,Glovo:8.95,"Canal Propio":0},active:true,weekSales:55 },
    { id:"pq02",name:"Quesadilla Butter Chicken",recipeId:"rq02",category:"Quesadillas",prices:{Sala:8.95,"Uber Eats":8.95,Glovo:8.95,"Canal Propio":0},active:true,weekSales:45 },
    { id:"pe01",name:"Nachos Guadalupe",recipeId:"re01",category:"Nachos",prices:{Sala:9.90,"Uber Eats":11.95,Glovo:11.95,"Canal Propio":0},active:true,weekSales:70 },
    { id:"pe02",name:"Nachos Cienfuegos",recipeId:"re02",category:"Nachos",prices:{Sala:9.50,"Uber Eats":11.50,Glovo:11.50,"Canal Propio":0},active:true,weekSales:40 },
    { id:"pe03",name:"Bacon Cheese Fries",recipeId:"re03",category:"Extras",prices:{Sala:6.90,"Uber Eats":6.95,Glovo:6.95,"Canal Propio":0},active:true,weekSales:45 },
    { id:"pe04",name:"Alitas Padre",recipeId:"re04",category:"Extras",prices:{Sala:6.90,"Uber Eats":7.50,Glovo:7.50,"Canal Propio":0},active:true,weekSales:38 },
  ];
  return { suppliers: suppliers, ingredients: ingredients, recipes: recipes, products: products };
}

var SEED = makeSeed();

function calcRC(rid, recs, ings, vis) {
  if (vis[rid]) return 0; vis[rid] = true;
  var rec = null;
  for (var x = 0; x < recs.length; x++) { if (recs[x].id === rid) { rec = recs[x]; break; } }
  if (!rec) return 0;
  var cost = 0;
  for (var j = 0; j < (rec.items || []).length; j++) {
    var it = rec.items[j];
    if (it.type === "ingredient") {
      for (var k = 0; k < ings.length; k++) { if (ings[k].id === it.refId) { cost += (ings[k].costPerUnit || 0) * (it.qty || 0); break; } }
    } else if (it.type === "recipe") {
      var sub = null;
      for (var m = 0; m < recs.length; m++) { if (recs[m].id === it.refId) { sub = recs[m]; break; } }
      if (sub && sub.yield > 0) { var v2 = {}; for (var key in vis) v2[key] = true; cost += (calcRC(it.refId, recs, ings, v2) / sub.yield) * (it.qty || 0); }
    }
  }
  return cost;
}

/* Collapsible Card */
function CollapseCard(props) {
  var st = useState(false);
  var open = st[0];
  var preview = props.preview || 3;
  var items = props.items || [];
  var shown = open ? items : items.slice(0, preview);
  var hasMore = items.length > preview;
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #eee", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: shown.length > 0 ? "1px solid #f3f3f3" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: props.color || "#B45309", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: props.color || "#333", letterSpacing: 0.3 }}>{props.title}</div>
            {props.subtitle && <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{props.subtitle}</div>}
          </div>
          {props.badge && <div style={{ fontSize: 22, fontWeight: 800, color: props.color || "#333" }}>{props.badge}</div>}
        </div>
      </div>
      {shown.length > 0 && <div style={{ padding: "6px 12px 8px" }}>{shown.map(function(item, idx) { return item; })}</div>}
      {hasMore && (
        <button onClick={function() { st[1](!open); }} style={{ width: "100%", padding: "10px", background: open ? "#f9f9f9" : "#fafafa", border: "none", borderTop: "1px solid #f0f0f0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#888", fontFamily: "inherit" }}>
          {open ? "Ver menos" : "Ver los " + items.length + " productos"}
        </button>
      )}
    </div>
  );
}

function RankRow(props) {
  var p = props.item;
  var idx = props.idx;
  var accentColor = props.color || "#333";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderRadius: 10, marginBottom: 2, background: props.bg || "transparent" }}>
      <div style={{ width: 24, height: 24, borderRadius: 12, background: idx < 3 ? accentColor + "12" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: idx < 3 ? accentColor : "#bbb", flexShrink: 0 }}>{idx + 1}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{p.name}</div>
        <div style={{ fontSize: 11, color: "#aaa" }}>{p.category} | PVP {fmt(p.pvp)}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: props.valueColor || accentColor }}>{props.mainValue}</div>
        <div style={{ fontSize: 10, color: "#aaa" }}>{props.subValue}</div>
      </div>
    </div>
  );
}

function Pill(props) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: (props.c || "#B45309") + "12", color: props.c || "#B45309" }}>{props.t}</span>;
}

function ChannelToggle(props) {
  var v = props.value;
  var base = { padding: "7px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" };
  return (
    <div style={{ display: "inline-flex", background: "#f0ede8", borderRadius: 12, padding: 3, gap: 2 }}>
      <button onClick={function() { props.onChange("sala"); }} style={{ ...base, background: v === "sala" ? "#fff" : "transparent", color: v === "sala" ? "#1a1a1a" : "#999", boxShadow: v === "sala" ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>Sala / Local</button>
      <button onClick={function() { props.onChange("delivery"); }} style={{ ...base, background: v === "delivery" ? "#B45309" : "transparent", color: v === "delivery" ? "#fff" : "#999", boxShadow: v === "delivery" ? "0 1px 4px rgba(180,83,9,.3)" : "none" }}>Delivery</button>
    </div>
  );
}

/* ====== MAIN APP ====== */
export default function App() {
  var s = SEED;
  var sup = useState(s.suppliers);
  var ing = useState(s.ingredients);
  var rec = useState(s.recipes);
  var prod = useState(s.products);
  var usr = useState(null);
  var pg = useState("dashboard");
  var stockAlerts = useState([]);
  var incidents = useState([]);
  var priceHistory = useState([]);
  var ideasState = useState([
    { id: "idea1", title: "Burrito de Birria", desc: "Burrito con birria de res, queso oaxaca, consomme para dip. Tendencia viral en EEUU y Mexico.", category: "nuevo producto", status: "idea", date: "20/03/2026", assignedTo: "", feedback: "" },
    { id: "idea2", title: "Postre Churros Rellenos", desc: "Churros rellenos de dulce de leche o Nutella. Margen alto, facil de hacer.", category: "nuevo producto", status: "por probar", date: "18/03/2026", assignedTo: "Carlos", feedback: "" },
    { id: "idea3", title: "Taco de Pescado", desc: "Taco de pescado rebozado con slaw de col y mayo chipotle. Ampliar oferta de proteinas.", category: "nuevo producto", status: "idea", date: "15/03/2026", assignedTo: "", feedback: "" },
    { id: "idea4", title: "Reducir porcion arroz burritos", desc: "De 70g a 60g. Ahorro 0.012/ud x 400uds/sem = 4.80/sem. Cliente no lo nota.", category: "optimizacion", status: "en prueba", date: "22/03/2026", assignedTo: "Maria", feedback: "Probado 3 dias. Nadie se ha quejado." },
    { id: "idea5", title: "Hacer guacamole in-house", desc: "Actualmente 5.00/kg. Con aguacate a 4.20/kg + lima + cilantro podria salir a 3.80/kg.", category: "optimizacion", status: "idea", date: "19/03/2026", assignedTo: "", feedback: "" },
  ]);
  var team = useState([
    { id: "u1", name: "Ale", role: "socio", local: null, active: true },
  ]);
  var weekTasks = useState([]);
  var prepStepsState = useState(JSON.parse(JSON.stringify(PREP_STEPS)));
  var opsData = useState({
    protocolos: [
      { id: "pr1", title: "Checklist cierre de bolsa", priority: "critica", category: "delivery", content: "1. Leer ticket COMPLETO (articulos + notas)\n2. Marcar ticket con rotulador (rojo=alergia, naranja=personalizacion)\n3. Preparar todos los articulos\n4. Agrupar en zona staging. CONTAR vs ticket\n5. Burritos: aluminio individual + contenedor cerrado\n6. Nachos: toppings en recipiente SEPARADO\n7. Bebida en bolsa separada\n8. Salsas/extras: recipientes cerrados\n9. Postre: verificar correcto (Kinder ≠ Lotus)\n10. Servilletas + cubiertos\n11. RECUENTO FINAL: articulos en bolsa = ticket\n12. Cerrar con precinto + ticket pegado fuera", active: true, date: "25/03/2026" },
      { id: "pr2", title: "Protocolo alergias (3 niveles)", priority: "critica", category: "seguridad", content: "ROJO (Alergia): Ticket independiente. Utensilios limpios. Encargado VERIFICA y FIRMA antes de cerrar.\nNARANJA (Personalizacion): Nota destacada. Doble verificacion: preparador lee, empaquetador relee.\nVERDE (Estandar): Sin modificaciones. Checklist normal 12 pasos.\n\nREGLA: Si tienes CUALQUIER duda sobre alergia, pregunta al encargado. SIEMPRE.", active: true, date: "25/03/2026" },
      { id: "pr3", title: "Temperatura de la comida", priority: "alta", category: "calidad", content: "- Planchas/hornos encendidos 30 min ANTES de aceptar pedidos\n- Nunca preparar burrito con mas de 5 min de antelacion al cierre de bolsa\n- Si rider no llega en 8 min: recalentar o rehacer\n- Burritos SIEMPRE en aluminio individual\n- Nachos: servir calientes, toppings aparte en delivery", active: true, date: "25/03/2026" },
      { id: "pr4", title: "Horas valle productivas", priority: "media", category: "organizacion", content: "Tareas para horas valle (entre servicios):\n- Desmenuzar carnes (cochinita, pulled pork)\n- Prep de salsas del dia\n- Revisar caducidades de camaras\n- Limpieza profunda de zona de montaje\n- Reponer packaging (aluminio, recipientes, bolsas)", active: true, date: "25/03/2026" },
    ],
    alertasProducto: [
      { id: "ap1", product: "Bacon Cheese Apachurradas", level: "sanitaria", local: "Sevilla Este", notes: "Clientes han enfermado. Revisar salsa ranchera, bacon y queso cada turno.", actions: "Auditar cadena frio. Si ingrediente raro: TIRAR y avisar.", date: "25/03/2026" },
      { id: "ap2", product: "Burro Lady Cochinita", level: "critico", local: "Todos", notes: "25% valoracion. Cochinita sin desmenuzar, mal cocinada, fria.", actions: "Desmenuzar SIEMPRE. Verificar coccion y temperatura. Aluminio individual.", date: "25/03/2026" },
      { id: "ap3", product: "Burro Don Juarez", level: "critico", local: "Todos", notes: "15+ incidencias. Sabor, temperatura, caso alergia cilantro.", actions: "Revisar receta. Aluminio obligatorio. Alergenos: rotulador rojo.", date: "25/03/2026" },
      { id: "ap4", product: "Nachos Guadalupe", level: "vigilar", local: "Todos", notes: "13+ incidencias. Textura y temperatura perdida en delivery.", actions: "Toppings SIEMPRE separados en delivery.", date: "25/03/2026" },
      { id: "ap5", product: "Burro Dona Dolores", level: "vigilar", local: "Todos", notes: "12+ incidencias. Excesivamente especiado.", actions: "Medida estandar de especiado. NUNCA a ojo.", date: "25/03/2026" },
      { id: "ap6", product: "Coca-Cola Zero", level: "atencion", local: "Todos", notes: "Se olvida frecuentemente en pedidos.", actions: "Siempre lo ultimo en la bolsa. Comprobar antes de cerrar.", date: "25/03/2026" },
    ],
    planAccion: [
      { id: "pa1", action: "Auditoria cadena de frio en los 3 locales", responsible: "Encargados + Ale", deadline: "Inmediato", status: "en curso", priority: "inmediata" },
      { id: "pa2", action: "Implementar checklist cierre de bolsa para TODOS los pedidos delivery", responsible: "Encargados", deadline: "Esta semana", status: "pendiente", priority: "inmediata" },
      { id: "pa3", action: "Sistema pegatina roja para pedidos con alergias/modificaciones", responsible: "Encargados", deadline: "Esta semana", status: "pendiente", priority: "inmediata" },
      { id: "pa4", action: "Estandarizar recetas problematicas (Dolores, cochinita, patatas)", responsible: "Cocina + Ale", deadline: "2 semanas", status: "pendiente", priority: "corto" },
      { id: "pa5", action: "Formacion equipo: alergias, notas, protocolo anti-errores", responsible: "Ale + encargados", deadline: "2 semanas", status: "pendiente", priority: "corto" },
      { id: "pa6", action: "Crear zona de staging para pedidos delivery en cada local", responsible: "Cada local", deadline: "2 semanas", status: "pendiente", priority: "corto" },
      { id: "pa7", action: "Evaluar packaging termico para burritos", responsible: "Ale", deadline: "3 semanas", status: "pendiente", priority: "corto" },
      { id: "pa8", action: "Manual de operaciones completo", responsible: "Ale + equipo", deadline: "1-2 meses", status: "pendiente", priority: "medio" },
      { id: "pa9", action: "Sistema de control productividad: pedidos/hora por local", responsible: "Ale", deadline: "1-2 meses", status: "pendiente", priority: "medio" },
    ],
    comunicados: [
      { id: "com1", title: "Nuevos protocolos de delivery activos", content: "A partir de hoy son obligatorios el checklist de cierre de bolsa y el protocolo de alergias de 3 niveles. Ningun pedido sale sin completar los 12 pasos. Sin excepciones.", author: "Ale", date: "25/03/2026", readBy: [] },
      { id: "com2", title: "Productos a vigilar esta semana", content: "Atencion especial a: Bacon Cheese (revisar ingredientes cada turno), Burro Lady Cochinita (desmenuzar siempre), Nachos delivery (toppings separados). Cualquier duda, preguntad al encargado.", author: "Ale", date: "25/03/2026", readBy: [] },
    ],
  });

  function getPC(p) {
    if (!p.recipeId) return 0;
    var r = null;
    for (var i = 0; i < rec[0].length; i++) { if (rec[0][i].id === p.recipeId) { r = rec[0][i]; break; } }
    if (!r || !r.yield) return 0;
    var unitCost = calcRC(p.recipeId, rec[0], ing[0], {}) / r.yield;
    return unitCost * (p.packQty || 1);
  }

  if (!usr[0]) {
    return (
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1a 0%, #2d1f0e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ background: "#fff", borderRadius: 20, padding: "44px 36px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "20px 24px", display: "inline-block", marginBottom: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#FAF6F1", letterSpacing: 1 }}>ORALE PADRE</div>
            </div>
            <div style={{ fontSize: 12, color: "#bbb", marginTop: 4, letterSpacing: 2, fontWeight: 500 }}>PLATAFORMA INTERNA</div>
          </div>
          <LoginForm onLogin={function(role, local, name) { usr[1]({ role: role, local: local, name: name }); }} />
        </div>
      </div>
    );
  }

  var role = usr[0].role;
  var isEmp = role === "empleado";

  var allNav = [
    { k: "dashboard", l: "Dashboard", roles: ["socio"], group: "inicio" },
    { k: "panel", l: "Panel", roles: ["encargado"], group: "inicio" },
    { k: "fichas-emp", l: "Recetas", roles: ["empleado","encargado"], group: "inicio" },
    { k: "sep1", l: "", roles: ["socio"], sep: true },
    { k: "products", l: "Productos", roles: ["socio"], group: "cocina" },
    { k: "ingredients", l: "Ingredientes", roles: ["socio"], group: "cocina" },
    { k: "recipes", l: "Escandallos", roles: ["socio"], group: "cocina" },
    { k: "suppliers", l: "Proveedores", roles: ["socio"], group: "cocina" },
    { k: "fichas", l: "Fichas", roles: ["socio"], group: "cocina" },
    { k: "sep2", l: "", roles: ["socio"], sep: true },
    { k: "pricing", l: "Precios", roles: ["socio"], group: "analisis" },
    { k: "matrix", l: "Matrix", roles: ["socio"], group: "analisis" },
    { k: "simulator", l: "Simulador", roles: ["socio"], group: "analisis" },
    { k: "sep3", l: "", roles: ["socio"], sep: true },
    { k: "promos", l: "Promos", roles: ["socio"], group: "comercial" },
    { k: "combos", l: "Combos", roles: ["socio"], group: "comercial" },
    { k: "sep4", l: "", roles: ["socio","encargado","empleado"], sep: true },
    { k: "turnos", l: "Turnos", roles: ["encargado"], group: "ops" },
    { k: "stock", l: "Stock", roles: ["empleado","encargado"], group: "ops" },
    { k: "operaciones", l: "Operaciones", roles: ["socio","encargado","empleado"], group: "ops" },
    { k: "incidencias", l: "Incidencias", roles: ["empleado","encargado","socio"], group: "ops" },
    { k: "tareas-id", l: "Tareas I+D", roles: ["encargado"], group: "ops" },
    { k: "id", l: "I+D", roles: ["socio"], group: "ops" },
    { k: "gestion", l: "Gestion", roles: ["socio"], group: "ops" },
  ];
  var nav = allNav.filter(function(n) { return n.roles.indexOf(role) >= 0; });

  // Default page per role
  if (isEmp && pg[0] === "dashboard") pg[1]("fichas-emp");
  if (role === "encargado" && pg[0] === "dashboard") pg[1]("panel");

  function resetAll() {
    var fresh = makeSeed();
    sup[1](fresh.suppliers); ing[1](fresh.ingredients); rec[1](fresh.recipes); prod[1](fresh.products);
    stockAlerts[1]([]); incidents[1]([]); team[1]([]);
  }

  var PP = { suppliers: sup[0], ingredients: ing[0], recipes: rec[0], products: prod[0], getPC: getPC, user: usr[0], stockAlerts: stockAlerts, incidents: incidents, priceHistory: priceHistory, ideasState: ideasState, weekTasks: weekTasks, prepSteps: prepStepsState, opsData: opsData, setSup: sup[1], setIng: ing[1], setRec: rec[1], setProd: prod[1], team: team, isSocio: role === "socio", resetAll: resetAll };

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#f6f4f0", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ background: "#1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#FAF6F1", letterSpacing: 1 }}>ORALE PADRE</div>
        <div style={{ flex: 1 }} />
        {/* Notification badge */}
        {(role === "socio" || role === "encargado") && (stockAlerts[0].length > 0 || incidents[0].filter(function(x){return x.status==="abierta";}).length > 0) && (
          <div onClick={function() { pg[1]("incidencias"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: "#DC262620", cursor: "pointer" }}>
            <span style={{ fontSize: 12 }}>🔔</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>
              {stockAlerts[0].length + incidents[0].filter(function(x){return x.status==="abierta";}).length}
            </span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: isEmp ? "#1E40AF" : role === "encargado" ? "#047857" : "#B45309", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{(usr[0].name || "U")[0].toUpperCase()}</div>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: "#eee" }}>{usr[0].name}</div><div style={{ fontSize: 10, color: "#888" }}>{usr[0].role}{usr[0].local ? " - " + usr[0].local : ""}</div></div>
        </div>
        <button onClick={function() { usr[1](null); pg[1]("dashboard"); }} style={{ background: "#333", color: "#aaa", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Salir</button>
      </div>
      {/* Nav */}
      <div className="op-nav" style={{ background: "#fff", padding: "6px 16px", borderBottom: "1px solid #eee", display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        {nav.map(function(n) {
          if (n.sep) return <div key={n.k} style={{ width: 1, height: 24, background: "#e5e5e5", margin: "0 6px", flexShrink: 0 }} />;
          var active = pg[0] === n.k;
          var badge = 0;
          if (n.k === "stock") badge = stockAlerts[0].length;
          if (n.k === "incidencias") badge = incidents[0].filter(function(x){return x.status==="abierta";}).length;
          if (n.k === "operaciones" && usr[0]) badge = opsData[0].comunicados.filter(function(c){ return (c.readBy||[]).indexOf(usr[0].name)<0; }).length;
          return (
            <button key={n.k} onClick={function() { pg[1](n.k); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", background: active ? "#B4530910" : "transparent", color: active ? "#B45309" : "#888", fontWeight: active ? 700 : 500, fontSize: 13 }}>
              {n.l}
              {badge > 0 && <span style={{ background: "#DC2626", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 5px" }}>{badge}</span>}
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{ padding: "24px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <style dangerouslySetInnerHTML={{ __html: "@media(min-width:1200px){.op-content{padding:28px 40px !important}} @media(max-width:640px){.op-nav{gap:2px !important} .op-nav button{padding:7px 10px !important;font-size:12px !important}}" }} />
        {pg[0] === "dashboard" && <DashView {...PP} />}
        {pg[0] === "panel" && <EncargadoPanel {...PP} />}
        {pg[0] === "suppliers" && <SupView {...PP} />}
        {pg[0] === "ingredients" && <IngView {...PP} />}
        {pg[0] === "recipes" && <RecView {...PP} />}
        {pg[0] === "products" && <ProdView {...PP} />}
        {pg[0] === "simulator" && <SimView {...PP} />}
        {pg[0] === "promos" && <PromoView {...PP} />}
        {pg[0] === "combos" && <ComboView {...PP} />}
        {pg[0] === "pricing" && <PricingView {...PP} />}
        {pg[0] === "matrix" && <MatrixView {...PP} />}
        {pg[0] === "gestion" && <GestionView {...PP} setSup={sup[1]} setIng={ing[1]} setRec={rec[1]} setProd={prod[1]} />}
        {pg[0] === "id" && <IDView {...PP} />}
        {pg[0] === "fichas" && <FichasView {...PP} />}
        {pg[0] === "fichas-emp" && <FichasEmpView {...PP} />}
        {pg[0] === "stock" && <StockView {...PP} />}
        {pg[0] === "operaciones" && <OpsView {...PP} />}
        {pg[0] === "turnos" && <TurnosView {...PP} />}
        {pg[0] === "incidencias" && <IncidenciasView {...PP} />}
        {pg[0] === "tareas-id" && <TareasIDView {...PP} />}
        {pg[0] === "equipo" && <EquipoView {...PP} />}
      </div>
      {/* Reset button for socio */}
      {role === "socio" && (
        <div style={{ padding: "12px 20px", textAlign: "center" }}>
          <button onClick={function() { if (confirm("Resetear todos los datos a los valores del Excel original?")) resetAll(); }} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e5e5e5", background: "#fff", color: "#aaa", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Resetear datos originales</button>
        </div>
      )}
    </div>
  );
}

var USERS = [
  { user: "ale", pass: "orale2026", name: "Alejandro", role: "socio", local: null },
  { user: "carlos", pass: "carlos2026", name: "Carlos", role: "encargado", local: "San Luis" },
  { user: "pedro", pass: "pedro2026", name: "Pedro", role: "empleado", local: "San Luis" },
];

function LoginForm(props) {
  var u = useState(""); var p = useState(""); var err = useState("");
  var inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  function doLogin() {
    var found = null;
    for (var i = 0; i < USERS.length; i++) { if (USERS[i].user === u[0].trim().toLowerCase() && USERS[i].pass === p[0]) { found = USERS[i]; break; } }
    if (found) { err[1](""); props.onLogin(found.role, found.local, found.name); }
    else { err[1]("Usuario o contrasena incorrectos"); }
  }
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>USUARIO</div>
        <input value={u[0]} onChange={function(e) { u[1](e.target.value); err[1](""); }} style={inp} placeholder="Tu usuario" onKeyDown={function(e) { if (e.key === "Enter") doLogin(); }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>CONTRASENA</div>
        <input type="password" value={p[0]} onChange={function(e) { p[1](e.target.value); err[1](""); }} style={inp} placeholder="Tu contrasena" onKeyDown={function(e) { if (e.key === "Enter") doLogin(); }} />
      </div>
      {err[0] && <div style={{ padding: "8px 14px", borderRadius: 8, background: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 600, marginBottom: 14, textAlign: "center" }}>{err[0]}</div>}
      <button onClick={doLogin} style={{ width: "100%", padding: 14, background: "#B45309", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}>Entrar</button>
      <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#f9f9f6", fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: "#888" }}>Cuentas de prueba:</div>
        <div>Socio: <strong>ale</strong> / orale2026</div>
        <div>Encargado: <strong>carlos</strong> / carlos2026</div>
        <div>Empleado: <strong>pedro</strong> / pedro2026</div>
      </div>
    </div>
  );
}

/* ====== DASHBOARD ====== */
function DashView(props) {
  var chS = useState("sala");
  var localF = useState("Todos");
  var isDel = chS[0] === "delivery";
  var data = [];
  for (var i = 0; i < props.products.length; i++) {
    var p = props.products[i];
    var cost = props.getPC(p);
    var sala = p.prices ? (p.prices.Sala || 0) : 0;
    var del = p.prices ? (p.prices["Uber Eats"] || 0) : 0;
    var pvp = isDel ? del : sala;
    var fc = pvp > 0 ? (cost / pvp) * 100 : 0;
    var margin = pvp > 0 ? pvp - cost : 0;
    data.push({ id: p.id, name: p.name, category: p.category, cost: cost, pvp: pvp, fc: fc, margin: margin });
  }
  var wp = data.filter(function(p) { return p.pvp > 0; });
  var avgFC = 0; var okCount = 0; var dangerCount = 0;
  for (var j = 0; j < wp.length; j++) { avgFC += wp[j].fc; if (wp[j].fc <= 32) okCount++; if (wp[j].fc > 35) dangerCount++; }
  if (wp.length > 0) avgFC = avgFC / wp.length;
  var bestFC = wp.slice().sort(function(a, b) { return a.fc - b.fc; });
  var bestM = wp.slice().sort(function(a, b) { return b.margin - a.margin; });
  var worstFC = wp.slice().sort(function(a, b) { return b.fc - a.fc; });

  var promos = []; var dangers = [];
  for (var r = 0; r < wp.length; r++) {
    var it = wp[r];
    if (it.fc <= 25 && it.margin >= 6) promos.push({ name: it.name, txt: "FC " + fPct(it.fc) + ", margen " + fmt(it.margin) + " - Aguanta 15-20% descuento" });
    else if (it.fc <= 30 && it.margin >= 5) promos.push({ name: it.name, txt: "FC " + fPct(it.fc) + ", margen " + fmt(it.margin) + " - Buen candidato promo horas valle" });
    if (it.fc > 40) dangers.push({ name: it.name, txt: "FC " + fPct(it.fc) + " - Revisar escandallo o subir precio", red: true });
    else if (it.fc > 32) dangers.push({ name: it.name, txt: "FC " + fPct(it.fc) + " - Margen ajustado, no aplicar descuentos", red: false });
  }

  var chLabel = isDel ? "Delivery" : "Sala";

  // Extra KPIs
  var wrongPrice = 0;
  for (var rr = 0; rr < props.products.length; rr++) {
    var pp = props.products[rr];
    var ppCost = props.getPC(pp);
    var ppPvp = isDel ? (pp.prices ? pp.prices["Uber Eats"] || 0 : 0) : (pp.prices ? pp.prices.Sala || 0 : 0);
    if (ppPvp > 0) {
      var ppFC = (ppCost / ppPvp) * 100;
      if (ppFC > 35) wrongPrice++;
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Dashboard</div>
          <div style={{ fontSize: 13, color: "#888" }}>Vision global del negocio - {chLabel}</div>
        </div>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
      </div>

      {/* TOP KPIs - Food Cost & Pricing Health */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1f0e 100%)", borderRadius: 14, padding: "18px 16px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#888", letterSpacing: 1, marginBottom: 6 }}>FC MEDIO</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: avgFC > 33 ? "#EF4444" : "#4ADE80", lineHeight: 1 }}>{fPct(avgFC)}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>Objetivo 28-32%</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#888", letterSpacing: 1, marginBottom: 6 }}>PRODUCTOS</div>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{props.products.length}</div>
          <div style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>{props.ingredients.length} ingr. | {props.suppliers.length} prov.</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#888", letterSpacing: 1, marginBottom: 6 }}>EN RANGO</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#047857", lineHeight: 1 }}>{okCount}<span style={{ fontSize: 14, color: "#aaa" }}>/{wp.length}</span></div>
          <div style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>FC menor 32%</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", textAlign: "center", border: "1px solid #eee", borderTop: dangerCount > 0 ? "4px solid #DC2626" : "4px solid #047857" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#888", letterSpacing: 1, marginBottom: 6 }}>ZONA ROJA</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: dangerCount > 0 ? "#DC2626" : "#047857", lineHeight: 1 }}>{dangerCount}</div>
          <div style={{ fontSize: 11, color: dangerCount > 0 ? "#DC2626" : "#ccc", marginTop: 4, fontWeight: dangerCount > 0 ? 600 : 400 }}>{dangerCount > 0 ? "FC mayor 35%" : "Todo OK"}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", textAlign: "center", border: "1px solid #eee", borderTop: wrongPrice > 0 ? "4px solid #D97706" : "4px solid #047857" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#888", letterSpacing: 1, marginBottom: 6 }}>PRECIOS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: wrongPrice > 0 ? "#D97706" : "#047857", lineHeight: 1 }}>{wrongPrice > 0 ? wrongPrice : "OK"}</div>
          <div style={{ fontSize: 11, color: wrongPrice > 0 ? "#D97706" : "#ccc", marginTop: 4, fontWeight: wrongPrice > 0 ? 600 : 400 }}>{wrongPrice > 0 ? "a revisar" : "Todos correctos"}</div>
        </div>
      </div>

      {/* Second row - Alerts summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: props.stockAlerts[0].length > 0 ? "#FEE2E2" : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{props.stockAlerts[0].length > 0 ? "📦" : "✓"}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: props.stockAlerts[0].length > 0 ? "#DC2626" : "#047857" }}>{props.stockAlerts[0].length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Alertas stock</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: props.incidents[0].filter(function(x){return x.status==="abierta";}).length > 0 ? "#FEF3C7" : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{props.incidents[0].filter(function(x){return x.status==="abierta";}).length > 0 ? "⚠️" : "✓"}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: props.incidents[0].filter(function(x){return x.status==="abierta";}).length > 0 ? "#D97706" : "#047857" }}>{props.incidents[0].filter(function(x){return x.status==="abierta";}).length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Incidencias abiertas</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🧪</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1E40AF" }}>{props.ideasState ? props.ideasState[0].filter(function(x){return x.status==="en prueba";}).length : 0}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Ideas en prueba</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FAF6F1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📊</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{props.priceHistory[0].length}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Cambios precio</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: (props.opsData ? props.opsData[0].alertasProducto.length : 0) > 0 ? "#FEE2E2" : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: (props.opsData ? props.opsData[0].alertasProducto.length : 0) > 0 ? "#DC2626" : "#047857" }}>{props.opsData ? props.opsData[0].alertasProducto.length : 0}</div>
            <div style={{ fontSize: 11, color: "#888" }}>Alertas producto</div>
          </div>
        </div>
      </div>

      {/* Ranking Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <CollapseCard title="MEJOR FOOD COST" subtitle={"Mas eficientes - " + chLabel} color="#047857" badge={fPct(bestFC.length > 0 ? bestFC[0].fc : 0)} preview={3}
          items={bestFC.map(function(p, idx) { return <RankRow key={p.id} item={p} idx={idx} color="#047857" mainValue={fPct(p.fc)} subValue={fmt(p.margin) + " margen"} />; })} />

        <CollapseCard title="MEJOR MARGEN" subtitle={"Mas beneficio bruto - " + chLabel} color="#1E40AF" badge={bestM.length > 0 ? fmt(bestM[0].margin) : "-"} preview={3}
          items={bestM.map(function(p, idx) { return <RankRow key={p.id} item={p} idx={idx} color="#1E40AF" mainValue={fmt(p.margin)} subValue={"FC " + fPct(p.fc)} />; })} />

        <CollapseCard title="MENOS RENTABLES" subtitle={"Peor food cost - " + chLabel} color="#DC2626" badge={worstFC.length > 0 ? fPct(worstFC[0].fc) : "-"} preview={3}
          items={worstFC.map(function(p, idx) {
            var bg = p.fc > 40 ? "#FEF2F2" : p.fc > 32 ? "#FFFBEB" : "transparent";
            return <RankRow key={p.id} item={p} idx={idx} color="#DC2626" bg={bg} mainValue={fPct(p.fc)} subValue={fmt(p.margin)} valueColor={p.fc > 35 ? "#DC2626" : "#D97706"} />;
          })} />

        <CollapseCard title="RECOMENDACIONES" subtitle={chLabel} color="#7C3AED" preview={4}
          items={[].concat(
            promos.map(function(r, idx) {
              return <div key={"p" + idx} style={{ padding: "10px 12px", marginBottom: 4, borderRadius: 10, background: "#F0FDF4", borderLeft: "3px solid #047857" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>{r.name}</div><div style={{ fontSize: 11, color: "#047857", marginTop: 2 }}>{r.txt}</div></div>;
            }),
            dangers.map(function(r, idx) {
              return <div key={"d" + idx} style={{ padding: "10px 12px", marginBottom: 4, borderRadius: 10, background: r.red ? "#FEF2F2" : "#FFFBEB", borderLeft: "3px solid " + (r.red ? "#DC2626" : "#D97706") }}><div style={{ fontSize: 13, fontWeight: 700, color: r.red ? "#991B1B" : "#92400E" }}>{r.name}</div><div style={{ fontSize: 11, color: r.red ? "#DC2626" : "#D97706", marginTop: 2 }}>{r.txt}</div></div>;
            })
          )} />
      </div>

      {/* Live Alerts from team - filtered by local */}
      {(props.stockAlerts[0].length > 0 || props.incidents[0].filter(function(x){return x.status==="abierta";}).length > 0) && (
        <div style={{ marginTop: 20 }}>
          {/* Local filter tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {["Todos"].concat(LOCALS).map(function(loc) {
              var isAll = loc === "Todos";
              var stockCount = isAll ? props.stockAlerts[0].length : props.stockAlerts[0].filter(function(a) { return a.local === loc; }).length;
              var incCount = isAll ? props.incidents[0].filter(function(x){return x.status==="abierta";}).length : props.incidents[0].filter(function(x){return x.status==="abierta" && x.local === loc;}).length;
              var total = stockCount + incCount;
              return (
                <button key={loc} onClick={function() { localF[1](loc); }} style={{ padding: "6px 14px", borderRadius: 8, border: localF[0] === loc ? "2px solid #B45309" : "1px solid #e5e5e5", background: localF[0] === loc ? "#B4530908" : "#fff", color: localF[0] === loc ? "#B45309" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {loc} {total > 0 && <span style={{ background: "#DC2626", color: "#fff", fontSize: 10, borderRadius: 8, padding: "1px 5px", marginLeft: 4 }}>{total}</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
            {(function() {
              var isAll = localF[0] === "Todos";
              var filteredAlerts = isAll ? props.stockAlerts[0] : props.stockAlerts[0].filter(function(a) { return a.local === localF[0]; });
              var filteredInc = isAll ? props.incidents[0].filter(function(x){return x.status==="abierta";}) : props.incidents[0].filter(function(x){return x.status==="abierta" && x.local === localF[0];});
              return [
                filteredAlerts.length > 0 && (
                  <div key="stock-alerts" style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", borderLeft: "4px solid #DC2626" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>📦</span>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>ALERTAS STOCK {!isAll && ("- " + localF[0])}</div>
                      <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 800, color: "#DC2626" }}>{filteredAlerts.length}</div>
                    </div>
                    {filteredAlerts.map(function(a) {
                      var isOut = a.level === "out";
                      return (
                        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid #f5f5f5" }}>
                          <span style={{ fontSize: 14 }}>{isOut ? "🔴" : "🟡"}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{a.category} | {isOut ? "AGOTADO" : "BAJO"} | {a.local} | {a.user} | {a.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
                filteredInc.length > 0 && (
                  <div key="inc-alerts" style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", borderLeft: "4px solid #D97706" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#D97706" }}>INCIDENCIAS {!isAll && ("- " + localF[0])}</div>
                      <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 800, color: "#D97706" }}>{filteredInc.length}</div>
                    </div>
                    {filteredInc.map(function(inc) {
                      return (
                        <div key={inc.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid #f5f5f5" }}>
                          {inc.urgent && <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>URGENTE</span>}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{inc.description}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{inc.user} | {inc.local} | {inc.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ),
              ];
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
/* ====== ENCARGADO PANEL ====== */
function EncargadoPanel(props) {
  var alerts = props.stockAlerts[0];
  var openInc = props.incidents[0].filter(function(x) { return x.status === "abierta"; });
  var urgentInc = openInc.filter(function(x) { return x.urgent; });
  var outStock = alerts.filter(function(a) { return a.level === "out"; });
  var lowStock = alerts.filter(function(a) { return a.level === "low"; });
  var myTasks = props.ideasState ? props.ideasState[0].filter(function(x) { return x.assignedTo === (props.user ? props.user.name : ""); }) : [];
  var pendingTasks = myTasks.filter(function(x) { return x.status === "por probar" || x.status === "en prueba"; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Panel de Control</div>
        <div style={{ fontSize: 13, color: "#888" }}>{props.user.local || "Todos los locales"} - Resumen operativo</div>
      </div>

      {/* Quick KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid " + (urgentInc.length > 0 ? "#DC2626" : "#047857") }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>URGENTES</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: urgentInc.length > 0 ? "#DC2626" : "#047857" }}>{urgentInc.length}</div>
        </div>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid " + (openInc.length > 0 ? "#D97706" : "#047857") }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>INCIDENCIAS</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: openInc.length > 0 ? "#D97706" : "#047857" }}>{openInc.length}</div>
        </div>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid " + (outStock.length > 0 ? "#DC2626" : "#047857") }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>AGOTADOS</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: outStock.length > 0 ? "#DC2626" : "#047857" }}>{outStock.length}</div>
        </div>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid " + (lowStock.length > 0 ? "#D97706" : "#047857") }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>STOCK BAJO</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: lowStock.length > 0 ? "#D97706" : "#047857" }}>{lowStock.length}</div>
        </div>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid #1E40AF" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>TAREAS I+D</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1E40AF" }}>{pendingTasks.length}</div>
        </div>
        <div style={{ ...crd, padding: 16, textAlign: "center", borderTop: "4px solid " + ((props.opsData ? props.opsData[0].alertasProducto.length : 0) > 0 ? "#DC2626" : "#047857") }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#888" }}>ALERTAS PROD.</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: (props.opsData ? props.opsData[0].alertasProducto.length : 0) > 0 ? "#DC2626" : "#047857" }}>{props.opsData ? props.opsData[0].alertasProducto.length : 0}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* Stock Alerts */}
        <div style={{ ...crd, borderLeft: "4px solid " + (alerts.length > 0 ? "#DC2626" : "#eee") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>📦</span>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Alertas de Stock</div>
            {alerts.length > 0 && <Pill t={alerts.length + " alertas"} c="#DC2626" />}
          </div>
          {alerts.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "#ccc", fontSize: 13 }}>Todo el stock OK - sin alertas del equipo</div>
          )}
          {outStock.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>AGOTADO</div>
              {outStock.map(function(a) {
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: "#FEE2E2" }}>
                    <span style={{ fontSize: 16 }}>🔴</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#DC2626" }}>{a.category} | Reportado: {a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {lowStock.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 8 }}>BAJO</div>
              {lowStock.map(function(a) {
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", marginBottom: 4, borderRadius: 8, background: "#FEF3C7" }}>
                    <span style={{ fontSize: 14 }}>🟡</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#D97706" }}>{a.category} | {a.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Open Incidents */}
        <div style={{ ...crd, borderLeft: "4px solid " + (openInc.length > 0 ? "#D97706" : "#eee") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Incidencias Abiertas</div>
            {openInc.length > 0 && <Pill t={openInc.length + " abiertas"} c="#D97706" />}
          </div>
          {openInc.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "#ccc", fontSize: 13 }}>Sin incidencias abiertas</div>
          )}
          {urgentInc.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>URGENTES</div>
              {urgentInc.map(function(inc) {
                return (
                  <div key={inc.id} style={{ padding: "12px", marginBottom: 6, borderRadius: 10, background: "#FEE2E2", borderLeft: "3px solid #DC2626" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>{inc.description}</div>
                      <button onClick={function() { var next = props.incidents[0].map(function(x) { return x.id === inc.id ? Object.assign({}, x, { status: "resuelta" }) : x; }); props.incidents[1](next); }} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #047857", background: "#F0FDF4", color: "#047857", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Resolver</button>
                    </div>
                    <div style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>{inc.user} | {inc.local} | {inc.time}</div>
                  </div>
                );
              })}
            </div>
          )}
          {openInc.filter(function(x) { return !x.urgent; }).length > 0 && (
            <div>
              {urgentInc.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 8 }}>OTRAS</div>}
              {openInc.filter(function(x) { return !x.urgent; }).map(function(inc) {
                return (
                  <div key={inc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{inc.description}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{inc.user} | {inc.local} | {inc.time}</div>
                    </div>
                    <button onClick={function() { var next = props.incidents[0].map(function(x) { return x.id === inc.id ? Object.assign({}, x, { status: "resuelta" }) : x; }); props.incidents[1](next); }} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #047857", background: "#F0FDF4", color: "#047857", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Resolver</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={crd}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Resumen operativo</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Productos en carta</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{props.products.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Ingredientes activos</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{props.ingredients.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Proveedores</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{props.suppliers.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Escandallos</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{props.recipes.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: "#888" }}>Incidencias resueltas hoy</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#047857" }}>{props.incidents[0].filter(function(x) { return x.status === "resuelta"; }).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de producto + Comunicados from Operaciones */}
      {(function() {
        var od = props.opsData ? props.opsData[0] : null;
        if (!od) return null;
        var userName = props.user ? props.user.name : "";
        var unreadComs = od.comunicados.filter(function(c) { return (c.readBy || []).indexOf(userName) < 0; });
        var lvlColors = { sanitaria: "#DC2626", critico: "#D97706", vigilar: "#1E40AF", atencion: "#7C3AED" };

        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginTop: 16 }}>
            {/* Alertas producto */}
            {od.alertasProducto.length > 0 && (
              <div style={{ ...crd, borderLeft: "4px solid #DC2626" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Productos a vigilar</div>
                  <Pill t={od.alertasProducto.length + ""} c="#DC2626" />
                </div>
                {od.alertasProducto.map(function(a) {
                  var lc = lvlColors[a.level] || "#888";
                  return (
                    <div key={a.id} style={{ padding: "10px 12px", marginBottom: 6, borderRadius: 10, background: lc + "08", borderLeft: "3px solid " + lc }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: lc }}>{a.product}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{a.level === "sanitaria" ? "ALERTA SANITARIA" : a.level.toUpperCase()} | {a.local}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{a.actions}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comunicados sin leer */}
            {unreadComs.length > 0 && (
              <div style={{ ...crd, borderLeft: "4px solid #D97706" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 18 }}>📢</span>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Comunicados nuevos</div>
                  <Pill t={unreadComs.length + " sin leer"} c="#D97706" />
                </div>
                {unreadComs.map(function(c) {
                  return (
                    <div key={c.id} style={{ padding: "10px 12px", marginBottom: 6, borderRadius: 10, background: "#FEF3C7", borderLeft: "3px solid #D97706" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>{c.author} | {c.date}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{c.content.length > 120 ? c.content.substring(0, 120) + "..." : c.content}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
function SupView(props) {
  var ss = useState("");
  var expanded = useState(null);
  var supTab = useState("actuales");
  var meetings = useState([
    { id: "m1", supplier: "R2R", date: "28/03/2026", topic: "Revision precios Q2 - negociar descuento en tortillas", status: "pendiente", notes: "" },
    { id: "m2", supplier: "Atlanta", date: "01/04/2026", topic: "Negociar precio Heura - buscar descuento por volumen", status: "pendiente", notes: "Pedir precio para 50kg/mes" },
  ]);
  var meetForm = useState({ supplier: "", date: "", topic: "" });
  var potentials = useState([
    { id: "pot1", name: "Proteinas Naturales SL", products: [{ name: "Soja texturizada", price: 8.50, unit: "kg" }, { name: "Heura alternativa", price: 18.00, unit: "kg" }], interest: "Alternativa vegana mas barata que Atlanta (Heura 43.45/kg)", sampleStatus: "pendiente", contact: "Laura Martinez", phone: "654 222 111", email: "info@protnat.es", notes: "" },
    { id: "pot2", name: "Carnes del Sur", products: [{ name: "Pulled pork ahumado", price: 7.50, unit: "kg" }, { name: "Brisket", price: 12.00, unit: "kg" }, { name: "Ribs BBQ", price: 9.80, unit: "kg" }], interest: "Alternativa a R2R para carnes BBQ", sampleStatus: "muestra recibida", contact: "Miguel", phone: "654 111 333", email: "ventas@carnesdelsur.es", notes: "Muestra probada el 20/03. Buena calidad pulled pork." },
  ]);
  var potForm = useState({ name: "", contact: "", phone: "", email: "", interest: "" });
  var potProducts = useState([]);
  var newPotProd = useState({ name: "", price: "", unit: "kg" });
  var expandedPot = useState(null);
  var editingMeeting = useState(null);
  var meetNotes = useState("");
  var showAddMeeting = useState(false);
  var showAddPotential = useState(false);

  var fl = props.suppliers.filter(function(s) { return s.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0; });
  var tabs = [{ k: "actuales", l: "Proveedores actuales" }, { k: "reuniones", l: "Reuniones" }, { k: "potenciales", l: "Potenciales" }];
  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };
  var btn = { padding: "8px 18px", background: "#B45309", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Proveedores</div>
        <div style={{ fontSize: 13, color: "#888" }}>Gestion de proveedores, reuniones y prospeccion</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(function(t) {
          var active = supTab[0] === t.k;
          var badge = 0;
          if (t.k === "reuniones") badge = meetings[0].filter(function(m) { return m.status === "pendiente"; }).length;
          if (t.k === "potenciales") badge = potentials[0].filter(function(p) { return p.sampleStatus === "pendiente"; }).length;
          return <button key={t.k} onClick={function() { supTab[1](t.k); }} style={{ padding: "8px 16px", borderRadius: 10, border: active ? "2px solid #B45309" : "1px solid #e5e5e5", background: active ? "#B4530908" : "#fff", color: active ? "#B45309" : "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.l}{badge > 0 ? " (" + badge + ")" : ""}</button>;
        })}
      </div>

      {/* ACTUALES TAB */}
      {supTab[0] === "actuales" && (
        <div>
          <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar proveedor..." style={{ maxWidth: 320, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fl.map(function(s) {
          var isOpen = expanded[0] === s.id;
          var supIngs = props.ingredients.filter(function(i) { return i.supplierId === s.id; });
          supIngs.sort(function(a, b) { return b.costPerUnit - a.costPerUnit; });
          return (
            <div key={s.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#B4530940" : "#eee"), overflow: "hidden" }}>
              <div onClick={function() { expanded[1](isOpen ? null : s.id); }} style={{ display: "flex", alignItems: "center", padding: "16px 20px", cursor: "pointer", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: isOpen ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isOpen ? "#B45309" : "#ccc", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{supIngs.length} ingredientes{s.contact ? " | " + s.contact : ""}{s.deliveryDays ? " | " + s.deliveryDays : ""}</div>
                </div>
                <Pill t={supIngs.length + " prod."} c="#1E40AF" />
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0f0f0" }}>
                  {/* Contact & conditions */}
                  <div style={{ display: "flex", gap: 12, padding: "14px 20px", background: "#fafaf8", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 140px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>CONTACTO</div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{s.contact || "-"}</div>
                      {s.phone && <div style={{ fontSize: 12, color: "#888" }}>{s.phone}</div>}
                      {s.email && <div style={{ fontSize: 11, color: "#1E40AF" }}>{s.email}</div>}
                    </div>
                    <div style={{ flex: "1 1 140px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>ENTREGAS</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.deliveryDays || "-"}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>Min: {s.minOrder || "-"}</div>
                    </div>
                    <div style={{ flex: "1 1 140px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>PAGO</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.payTerms || "-"}</div>
                    </div>
                  </div>
                  {(s.discount || s.rappel) && (
                    <div style={{ padding: "10px 20px", display: "flex", gap: 12 }}>
                      {s.discount && s.discount !== "-" && <div style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#F0FDF4", borderLeft: "3px solid #047857" }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>DESCUENTO</div><div style={{ fontSize: 12, fontWeight: 600, color: "#047857" }}>{s.discount}</div></div>}
                      {s.rappel && s.rappel !== "-" && <div style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "#EFF6FF", borderLeft: "3px solid #1E40AF" }}><div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>RAPPEL</div><div style={{ fontSize: 12, fontWeight: 600, color: "#1E40AF" }}>{s.rappel}</div></div>}
                    </div>
                  )}
                  {s.commercialNotes && (
                    <div style={{ padding: "6px 20px 14px" }}><div style={{ padding: "8px 12px", borderRadius: 8, background: "#FFFBEB", borderLeft: "3px solid #D97706", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>{s.commercialNotes}</div></div>
                  )}
                  {/* Ingredients table */}
                  <div style={{ padding: "0 20px 16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>INGREDIENTES</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr style={{ background: "#fafaf8", borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>INGREDIENTE</th>
                        <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>CATEGORIA</th>
                        <th style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>COSTE</th>
                        <th style={{ padding: "6px 10px", textAlign: "center", fontWeight: 600, color: "#aaa", fontSize: 10 }}>UD</th>
                      </tr></thead>
                      <tbody>{supIngs.map(function(i) {
                        return (<tr key={i.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                          <td style={{ padding: "7px 10px", fontWeight: 600 }}>{i.name}</td>
                          <td style={{ padding: "7px 10px" }}><Pill t={i.category} c="#1E40AF" /></td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: 700, color: i.costPerUnit > 15 ? "#DC2626" : "#333" }}>{fmt(i.costPerUnit)}</td>
                          <td style={{ padding: "7px 10px", textAlign: "center", color: "#888" }}>{i.unit}</td>
                        </tr>);
                      })}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
        </div>
      )}

      {/* REUNIONES TAB */}
      {supTab[0] === "reuniones" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#888" }}>Reuniones, negociaciones y tareas con proveedores.</div>
            <button onClick={function() { showAddMeeting[1](!showAddMeeting[0]); }} style={btn}>{showAddMeeting[0] ? "Cancelar" : "+ Nueva reunion"}</button>
          </div>
          {showAddMeeting[0] && (
            <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #047857" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Proveedor</div>
                  <select value={meetForm[0].supplier} onChange={function(e) { meetForm[1](Object.assign({}, meetForm[0], { supplier: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                    <option value="">Seleccionar</option>
                    {props.suppliers.map(function(s) { return <option key={s.id} value={s.name}>{s.name}</option>; })}
                  </select>
                </div>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Fecha</div><input type="date" value={meetForm[0].date} onChange={function(e) { meetForm[1](Object.assign({}, meetForm[0], { date: e.target.value })); }} style={inp} /></div>
              </div>
              <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Tema / Objetivo</div><input value={meetForm[0].topic} onChange={function(e) { meetForm[1](Object.assign({}, meetForm[0], { topic: e.target.value })); }} style={inp} placeholder="Ej: Negociar precios Q2..." /></div>
              <button onClick={function() {
                if (!meetForm[0].supplier || !meetForm[0].topic) return;
                meetings[1]([{ id: "m" + Date.now(), supplier: meetForm[0].supplier, date: meetForm[0].date, topic: meetForm[0].topic, status: "pendiente", notes: "" }].concat(meetings[0]));
                meetForm[1]({ supplier: "", date: "", topic: "" }); showAddMeeting[1](false);
              }} style={btn}>Guardar</button>
            </div>
          )}
          {meetings[0].map(function(m) {
            var done = m.status === "hecha";
            var isEditingM = editingMeeting[0] === m.id;
            return (
              <div key={m.id} style={{ ...crd, marginBottom: 10, borderLeft: "4px solid " + (done ? "#047857" : m.status === "cancelada" ? "#DC2626" : "#D97706"), opacity: done || m.status === "cancelada" ? 0.6 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{m.supplier}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{m.date} | {m.topic}</div>
                  </div>
                  <select value={m.status} onChange={function(e) { meetings[1](meetings[0].map(function(x) { return x.id === m.id ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: "#fff", color: done ? "#047857" : "#D97706" }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="hecha">Hecha</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button onClick={function() { if (isEditingM) { editingMeeting[1](null); } else { editingMeeting[1](m.id); meetNotes[1](m.notes || ""); } }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #1E40AF", background: isEditingM ? "#1E40AF" : "#EFF6FF", color: isEditingM ? "#fff" : "#1E40AF", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{isEditingM ? "Cerrar" : "Notas"}</button>
                  <button onClick={function() { meetings[1](meetings[0].filter(function(x) { return x.id !== m.id; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
                </div>
                {m.notes && !isEditingM && <div style={{ fontSize: 12, color: "#666", padding: "8px 12px", background: "#f9f9f6", borderRadius: 8, marginTop: 4 }}>{m.notes}</div>}
                {isEditingM && (
                  <div style={{ marginTop: 8 }}>
                    <textarea value={meetNotes[0]} onChange={function(e) { meetNotes[1](e.target.value); }} rows="3" placeholder="Notas de la reunion, acuerdos, pendientes..." style={{ ...inp, resize: "vertical", marginBottom: 8 }} />
                    <button onClick={function() { meetings[1](meetings[0].map(function(x) { return x.id === m.id ? Object.assign({}, x, { notes: meetNotes[0] }) : x; })); editingMeeting[1](null); }} style={btn}>Guardar notas</button>
                  </div>
                )}
              </div>
            );
          })}
          {meetings[0].length === 0 && <div style={{ ...crd, textAlign: "center", padding: 30, color: "#ccc", fontSize: 13 }}>Sin reuniones registradas</div>}
        </div>
      )}

      {/* POTENCIALES TAB */}
      {supTab[0] === "potenciales" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#888" }}>Proveedores en prospeccion con productos, precios y muestras.</div>
            <button onClick={function() { showAddPotential[1](!showAddPotential[0]); potProducts[1]([]); }} style={btn}>{showAddPotential[0] ? "Cancelar" : "+ Nuevo potencial"}</button>
          </div>

          {/* Add potential form */}
          {showAddPotential[0] && (
            <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #7C3AED" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Nuevo proveedor potencial</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Empresa</div><input value={potForm[0].name} onChange={function(e) { potForm[1](Object.assign({}, potForm[0], { name: e.target.value })); }} style={inp} placeholder="Nombre empresa" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Contacto</div><input value={potForm[0].contact} onChange={function(e) { potForm[1](Object.assign({}, potForm[0], { contact: e.target.value })); }} style={inp} placeholder="Nombre contacto" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Telefono</div><input value={potForm[0].phone} onChange={function(e) { potForm[1](Object.assign({}, potForm[0], { phone: e.target.value })); }} style={inp} placeholder="654 xxx xxx" /></div>
                <div><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Email</div><input value={potForm[0].email} onChange={function(e) { potForm[1](Object.assign({}, potForm[0], { email: e.target.value })); }} style={inp} placeholder="email@empresa.com" /></div>
              </div>
              <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Por que interesa</div><input value={potForm[0].interest} onChange={function(e) { potForm[1](Object.assign({}, potForm[0], { interest: e.target.value })); }} style={inp} placeholder="Mas barato, mejor calidad, producto exclusivo..." /></div>

              {/* Product list builder */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 8 }}>PRODUCTOS DE ESTE PROVEEDOR</div>
              {potProducts[0].map(function(pp, idx) {
                return (
                  <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{pp.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#047857" }}>{pp.price} E/{pp.unit}</span>
                    <button onClick={function() { potProducts[1](potProducts[0].filter(function(x, xi) { return xi !== idx; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14 }}>x</button>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 6, marginTop: 6, marginBottom: 12 }}>
                <input value={newPotProd[0].name} onChange={function(e) { newPotProd[1](Object.assign({}, newPotProd[0], { name: e.target.value })); }} style={{ ...inp, flex: 2, padding: "7px 10px", fontSize: 13 }} placeholder="Producto" />
                <input type="number" step="0.01" value={newPotProd[0].price} onChange={function(e) { newPotProd[1](Object.assign({}, newPotProd[0], { price: e.target.value })); }} style={{ ...inp, flex: 1, padding: "7px 10px", fontSize: 13, textAlign: "right" }} placeholder="Precio" />
                <select value={newPotProd[0].unit} onChange={function(e) { newPotProd[1](Object.assign({}, newPotProd[0], { unit: e.target.value })); }} style={{ ...inp, width: 55, padding: "7px 4px", fontSize: 13, background: "#fff" }}><option value="kg">kg</option><option value="ud">ud</option><option value="L">L</option></select>
                <button onClick={function() { if (!newPotProd[0].name) return; potProducts[1](potProducts[0].concat([{ name: newPotProd[0].name, price: parseFloat(newPotProd[0].price) || 0, unit: newPotProd[0].unit }])); newPotProd[1]({ name: "", price: "", unit: "kg" }); }} style={{ ...btn, padding: "7px 12px", fontSize: 12 }}>+</button>
              </div>

              <button onClick={function() {
                if (!potForm[0].name) return;
                potentials[1](potentials[0].concat([{ id: "pot" + Date.now(), name: potForm[0].name, products: potProducts[0].slice(), interest: potForm[0].interest, sampleStatus: "pendiente", contact: potForm[0].contact, phone: potForm[0].phone, email: potForm[0].email, notes: "" }]));
                potForm[1]({ name: "", contact: "", phone: "", email: "", interest: "" }); potProducts[1]([]); showAddPotential[1](false);
              }} style={btn}>Guardar proveedor potencial</button>
            </div>
          )}

          {/* Potential suppliers list */}
          {potentials[0].map(function(pot) {
            var sColors = { "pendiente": "#D97706", "muestra pedida": "#1E40AF", "muestra recibida": "#7C3AED", "aprobado": "#047857", "descartado": "#DC2626" };
            var sc = sColors[pot.sampleStatus] || "#888";
            var isExpanded = expandedPot[0] === pot.id;

            return (
              <div key={pot.id} style={{ ...crd, marginBottom: 10, borderLeft: "4px solid " + sc, overflow: "hidden" }}>
                {/* Header */}
                <div onClick={function() { expandedPot[1](isExpanded ? null : pot.id); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{pot.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{pot.contact}{pot.phone ? " | " + pot.phone : ""} | {(pot.products || []).length} productos</div>
                  </div>
                  <select value={pot.sampleStatus} onClick={function(e) { e.stopPropagation(); }} onChange={function(e) { potentials[1](potentials[0].map(function(x) { return x.id === pot.id ? Object.assign({}, x, { sampleStatus: e.target.value }) : x; })); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: "#fff", color: sc }}>
                    <option value="pendiente">Pendiente</option>
                    <option value="muestra pedida">Muestra pedida</option>
                    <option value="muestra recibida">Muestra recibida</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="descartado">Descartado</option>
                  </select>
                  <div style={{ fontSize: 12, color: isExpanded ? "#B45309" : "#ccc", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f0", paddingTop: 14 }}>
                    {/* Contact info */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                      <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f9f9f6", flex: "1 1 150px" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>CONTACTO</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{pot.contact || "-"}</div>
                        {pot.phone && <div style={{ fontSize: 12, color: "#888" }}>{pot.phone}</div>}
                        {pot.email && <div style={{ fontSize: 11, color: "#1E40AF" }}>{pot.email}</div>}
                      </div>
                      <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f9f9f6", flex: "1 1 200px" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>INTERES</div>
                        <div style={{ fontSize: 13, color: "#555" }}>{pot.interest || "-"}</div>
                      </div>
                    </div>

                    {/* Products with prices */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginBottom: 8 }}>PRODUCTOS Y PRECIOS</div>
                      {(pot.products || []).length === 0 && <div style={{ fontSize: 12, color: "#ccc", padding: 8 }}>Sin productos registrados</div>}
                      <div style={{ background: "#fafaf8", borderRadius: 10, overflow: "hidden" }}>
                        {(pot.products || []).map(function(pp, idx) {
                          return (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
                              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{pp.name}</div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: "#047857" }}>{pp.price.toFixed(2)} E<span style={{ fontSize: 11, fontWeight: 500, color: "#888" }}>/{pp.unit}</span></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    {pot.notes && <div style={{ fontSize: 12, color: "#1E40AF", padding: "8px 12px", background: "#EFF6FF", borderRadius: 8, marginBottom: 14 }}>{pot.notes}</div>}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {/* Convert to actual supplier */}
                      <button onClick={function() {
                        var newSup = { id: "s-" + Date.now(), name: pot.name, locals: LOCALS, notes: (pot.products || []).map(function(pp) { return pp.name + " " + pp.price + "/" + pp.unit; }).join(", "), contact: pot.contact || "", phone: pot.phone || "", email: pot.email || "", deliveryDays: "", minOrder: "", payTerms: "", discount: "", rappel: "", commercialNotes: "Convertido de proveedor potencial. " + (pot.interest || "") };
                        props.setSup(props.suppliers.concat([newSup]));
                        potentials[1](potentials[0].filter(function(x) { return x.id !== pot.id; }));
                      }} style={{ ...btn, background: "#047857", padding: "10px 20px" }}>Convertir en proveedor actual</button>
                      <button onClick={function() { potentials[1](potentials[0].filter(function(x) { return x.id !== pot.id; })); }} style={{ ...btn, background: "#fff", color: "#DC2626", border: "1px solid #DC2626", padding: "10px 20px" }}>Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {potentials[0].length === 0 && <div style={{ ...crd, textAlign: "center", padding: 30, color: "#ccc", fontSize: 13 }}>Sin proveedores potenciales</div>}
        </div>
      )}
    </div>
  );
}
function IngView(props) {
  var ss = useState(""); var cs = useState(""); var editing = useState(null); var editVal = useState("");
  var fl = props.ingredients.filter(function(i) { return i.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0 && (!cs[0] || i.category === cs[0]); });
  function sn(id) { for (var i = 0; i < props.suppliers.length; i++) { if (props.suppliers[i].id === id) return props.suppliers[i].name; } return "-"; }
  function saveCost(ingId) {
    var v = parseFloat(editVal[0]);
    if (isNaN(v) || v <= 0) { editing[1](null); return; }
    props.setIng(props.ingredients.map(function(i) { return i.id === ingId ? Object.assign({}, i, { costPerUnit: v }) : i; }));
    editing[1](null);
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar..." style={{ maxWidth: 260, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        <select value={cs[0]} onChange={function(e) { cs[1](e.target.value); }} style={{ padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}>
          <option value="">Todas</option>
          {ING_CATS.map(function(c) { return <option key={c} value={c}>{c}</option>; })}
        </select>
        {props.isSocio && <span style={{ fontSize: 11, color: "#aaa", alignSelf: "center" }}>Click en precio para editar</span>}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>INGREDIENTE</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>PROVEEDOR</th>
            <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>COSTE</th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}>UD</th>
          </tr></thead>
          <tbody>{fl.map(function(i) {
            var isEditing = editing[0] === i.id;
            return (
              <tr key={i.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "10px 16px" }}><span style={{ fontWeight: 600 }}>{i.name}</span><br /><span style={{ fontSize: 11, color: "#bbb" }}>{i.category}</span></td>
                <td style={{ padding: "10px 16px", color: "#888" }}>{sn(i.supplierId)}</td>
                <td style={{ padding: "10px 16px", textAlign: "right" }}>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <input autoFocus value={editVal[0]} onChange={function(e) { editVal[1](e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") saveCost(i.id); if (e.key === "Escape") editing[1](null); }} style={{ width: 80, padding: "4px 8px", border: "2px solid #B45309", borderRadius: 6, fontSize: 13, textAlign: "right", fontFamily: "inherit", fontWeight: 700 }} type="number" step="0.01" />
                      <button onClick={function() { saveCost(i.id); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "#B45309", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>OK</button>
                    </div>
                  ) : (
                    <span onClick={props.isSocio ? function() { editing[1](i.id); editVal[1](i.costPerUnit.toString()); } : undefined} style={{ fontWeight: 700, cursor: props.isSocio ? "pointer" : "default", padding: "2px 6px", borderRadius: 4, background: props.isSocio ? "#fafaf8" : "transparent" }}>{fmt(i.costPerUnit)}</span>
                  )}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "center", color: "#aaa" }}>{i.unit}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ====== RECIPES ====== */
function RecView(props) {
  var ss = useState("");
  var openCat = useState(null);
  var chS = useState("sala");
  var isDel = chS[0] === "delivery";
  var chLabel = isDel ? "Delivery" : "Sala";
  var fl = props.recipes.filter(function(r) { return r.type === "escandallo" && r.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0; });

  // Group recipes by product category
  var grouped = {};
  var catOrder = ["Burritos", "Bowls", "Tacos", "Quesadillas", "Nachos", "Extras"];
  for (var i = 0; i < fl.length; i++) {
    var r = fl[i];
    var cat = "Otros";
    for (var p = 0; p < props.products.length; p++) {
      if (props.products[p].recipeId === r.id) { cat = props.products[p].category; break; }
    }
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  }
  // Sorted categories
  var cats = [];
  for (var c = 0; c < catOrder.length; c++) { if (grouped[catOrder[c]]) cats.push(catOrder[c]); }
  for (var k in grouped) { if (catOrder.indexOf(k) < 0) cats.push(k); }

  var catEmojis = { "Burritos": "🌯", "Bowls": "🥗", "Tacos": "🌮", "Quesadillas": "🧀", "Nachos": "🍿", "Extras": "🍟", "Otros": "📋" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Escandallos</div>
          <div style={{ fontSize: 13, color: "#888" }}>Desglose de costes por producto - precios {chLabel}</div>
        </div>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
      </div>
      <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar escandallo..." style={{ maxWidth: 320, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cats.map(function(cat) {
          var items = grouped[cat];
          var isOpen = openCat[0] === cat || ss[0].length > 0;
          // Category average FC
          var catAvgCost = 0; var catAvgFC = 0; var catFCCount = 0;
          for (var ci = 0; ci < items.length; ci++) {
            var ciCost = calcRC(items[ci].id, props.recipes, props.ingredients, {}) / (items[ci].yield || 1);
            var ciProd = null;
            for (var cip = 0; cip < props.products.length; cip++) { if (props.products[cip].recipeId === items[ci].id) { ciProd = props.products[cip]; break; } }
            var ciPack = ciProd ? (ciProd.packQty || 1) : 1;
            var ciPC = ciCost * ciPack;
            catAvgCost += ciPC;
            var ciPvp = isDel ? (ciProd && ciProd.prices ? ciProd.prices["Uber Eats"] || 0 : 0) : (ciProd && ciProd.prices ? ciProd.prices.Sala || 0 : 0);
            if (ciPvp > 0) { catAvgFC += (ciPC / ciPvp) * 100; catFCCount++; }
          }
          catAvgCost = items.length > 0 ? catAvgCost / items.length : 0;
          var avgFC = catFCCount > 0 ? catAvgFC / catFCCount : 0;

          return (
            <div key={cat} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#B4530940" : "#eee"), overflow: "hidden" }}>
              <div onClick={function() { openCat[1](isOpen && !ss[0] ? null : cat); }} style={{ display: "flex", alignItems: "center", padding: "16px 20px", cursor: "pointer", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{catEmojis[cat] || "📋"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{cat}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{items.length} escandallos | Coste medio {fmt(catAvgCost)} | FC medio <span style={{ color: avgFC > 35 ? "#DC2626" : avgFC > 30 ? "#D97706" : "#047857", fontWeight: 700 }}>{fPct(avgFC)}</span></div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: isOpen ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isOpen ? "#B45309" : "#ccc", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                    {items.map(function(r) {
                      var cost = calcRC(r.id, props.recipes, props.ingredients, {});
                      var per = r.yield > 0 ? cost / r.yield : 0;
                      var linkedProd = null;
                      for (var lp = 0; lp < props.products.length; lp++) { if (props.products[lp].recipeId === r.id) { linkedProd = props.products[lp]; break; } }
                      var packQty = linkedProd ? (linkedProd.packQty || 1) : 1;
                      var productCost = per * packQty;
                      var pvpSala = linkedProd && linkedProd.prices ? (linkedProd.prices.Sala || 0) : 0;
                      var pvpDel = linkedProd && linkedProd.prices ? (linkedProd.prices["Uber Eats"] || 0) : 0;
                      var pvp = isDel ? pvpDel : pvpSala;
                      var fc = pvp > 0 ? (productCost / pvp) * 100 : 0;
                      var isPack = packQty > 1;

                      return (
                        <div key={r.id} style={{ padding: "14px 16px", borderRadius: 10, background: "#fafaf8", borderLeft: "3px solid " + (fc > 35 ? "#DC2626" : fc > 30 ? "#D97706" : "#047857") }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.name.replace("Esc ", "")}</div>
                          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>{(r.items || []).length} ingredientes | {r.notes}{isPack ? " | x" + packQty + " uds" : ""}</div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <div><div style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>{isPack ? "COSTE/UD" : "COSTE"}</div><div style={{ fontSize: 16, fontWeight: 800, color: "#B45309" }}>{fmt(per)}</div></div>
                            {isPack && <div><div style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>COSTE x{packQty}</div><div style={{ fontSize: 16, fontWeight: 800, color: "#B45309" }}>{fmt(productCost)}</div></div>}
                            {pvp > 0 && <div><div style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>PVP {chLabel}</div><div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(pvp)}</div></div>}
                            {pvp > 0 && <div><div style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>FC {chLabel}</div><div style={{ fontSize: 16, fontWeight: 800, color: fc > 35 ? "#DC2626" : fc > 30 ? "#D97706" : "#047857" }}>{fPct(fc)}</div></div>}
                            {pvpSala > 0 && pvpDel > 0 && pvpSala !== pvpDel && (
                              <div style={{ padding: "4px 10px", borderRadius: 6, background: isDel ? "#F0FDF4" : "#EFF6FF", alignSelf: "center" }}>
                                <div style={{ fontSize: 9, color: "#888", fontWeight: 600 }}>{isDel ? "SALA" : "DELIVERY"}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>FC {fPct((productCost / (isDel ? pvpSala : pvpDel)) * 100)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====== PRODUCTS ====== */
function ProdView(props) {
  var ss = useState(""); var cs = useState(""); var chS = useState("sala");
  var expanded = useState(null);
  var isDel = chS[0] === "delivery";
  var fl = props.products.filter(function(p) { return p.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0 && (!cs[0] || p.category === cs[0]); });

  function getRecipeItems(recipeId) {
    var rec = null;
    for (var i = 0; i < props.recipes.length; i++) { if (props.recipes[i].id === recipeId) { rec = props.recipes[i]; break; } }
    if (!rec) return [];
    var items = [];
    for (var j = 0; j < (rec.items || []).length; j++) {
      var it = rec.items[j];
      if (it.type === "ingredient") {
        for (var k = 0; k < props.ingredients.length; k++) {
          if (props.ingredients[k].id === it.refId) {
            var ing = props.ingredients[k];
            var lineCost = (ing.costPerUnit || 0) * (it.qty || 0);
            var qtyDisplay = ing.unit === "ud" ? (it.qty || 0) + " ud" : Math.round((it.qty || 0) * 1000) + "g";
            items.push({ name: ing.name, qty: qtyDisplay, unit: ing.unit, costPerUnit: ing.costPerUnit, lineCost: lineCost, supplier: "" });
            // find supplier name
            for (var s = 0; s < props.suppliers.length; s++) {
              if (props.suppliers[s].id === ing.supplierId) { items[items.length - 1].supplier = props.suppliers[s].name; break; }
            }
            break;
          }
        }
      }
    }
    items.sort(function(a, b) { return b.lineCost - a.lineCost; });
    return items;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar producto..." style={{ maxWidth: 260, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        <select value={cs[0]} onChange={function(e) { cs[1](e.target.value); }} style={{ padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}>
          <option value="">Todas</option>
          {PROD_CATS.map(function(c) { return <option key={c} value={c}>{c}</option>; })}
        </select>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {fl.map(function(p) {
          var cost = props.getPC(p);
          var pvp = isDel ? (p.prices ? p.prices["Uber Eats"] || 0 : 0) : (p.prices ? p.prices.Sala || 0 : 0);
          var fc = pvp > 0 ? (cost / pvp) * 100 : 0;
          var mg = pvp > 0 ? pvp - cost : 0;
          var fcC = fc > 35 ? "#DC2626" : fc > 30 ? "#D97706" : fc > 0 ? "#047857" : "#ccc";
          var isOpen = expanded[0] === p.id;
          var escItems = isOpen ? getRecipeItems(p.recipeId) : [];

          return (
            <div key={p.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#B4530940" : "#eee"), overflow: "hidden", transition: "border-color 0.2s" }}>
              {/* Product Row */}
              <div onClick={function() { expanded[1](isOpen ? null : p.id); }} style={{ display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: isOpen ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isOpen ? "#B45309" : "#ccc", flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 60 }}>
                  <div style={{ fontSize: 12, color: "#888" }}>Coste</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(cost)}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 60 }}>
                  <div style={{ fontSize: 12, color: "#888" }}>PVP</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{pvp > 0 ? fmt(pvp) : "-"}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 55 }}>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: fcC + "15", color: fcC }}>{pvp > 0 ? fPct(fc) : "-"}</span>
                </div>
                <div style={{ textAlign: "right", minWidth: 60 }}>
                  <div style={{ fontSize: 12, color: "#888" }}>Margen</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: mg > 0 ? "#047857" : "#DC2626" }}>{pvp > 0 ? fmt(mg) : "-"}</div>
                </div>
              </div>

              {/* Expanded Escandallo */}
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0f0f0", background: "#fafaf8" }}>
                  {/* Summary bar */}
                  <div style={{ display: "flex", gap: 16, padding: "12px 16px", flexWrap: "wrap", fontSize: 12, color: "#888" }}>
                    <span>Escandallo: <strong style={{ color: "#333" }}>{escItems.length} ingredientes</strong></span>
                    <span>Coste total: <strong style={{ color: "#B45309" }}>{fmt(cost)}</strong></span>
                    {pvp > 0 && <span>FC: <strong style={{ color: fcC }}>{fPct(fc)}</strong></span>}
                    <span>Sala: <strong>{fmt(p.prices ? p.prices.Sala || 0 : 0)}</strong></span>
                    <span>Delivery: <strong>{fmt(p.prices ? p.prices["Uber Eats"] || 0 : 0)}</strong></span>
                  </div>
                  {/* Ingredient breakdown */}
                  <div style={{ padding: "0 16px 14px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr style={{ borderBottom: "1px solid #e8e8e8" }}>
                        <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>INGREDIENTE</th>
                        <th style={{ padding: "8px 8px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>PROVEEDOR</th>
                        <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>CANTIDAD</th>
                        <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>PRECIO/UD</th>
                        <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>COSTE LINEA</th>
                        <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>% DEL TOTAL</th>
                      </tr></thead>
                      <tbody>
                        {escItems.map(function(item, idx) {
                          var pctOfTotal = cost > 0 ? (item.lineCost / cost) * 100 : 0;
                          var isTop = idx < 2;
                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0", background: isTop ? "#B4530906" : "transparent" }}>
                              <td style={{ padding: "8px 8px", fontWeight: isTop ? 600 : 400 }}>{item.name}</td>
                              <td style={{ padding: "8px 8px", color: "#999" }}>{item.supplier}</td>
                              <td style={{ padding: "8px 8px", textAlign: "right", color: "#666" }}>{item.qty}</td>
                              <td style={{ padding: "8px 8px", textAlign: "right", color: "#888" }}>{fmt(item.costPerUnit)}/{item.unit}</td>
                              <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 700 }}>{fmt(item.lineCost)}</td>
                              <td style={{ padding: "8px 8px", textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                  <div style={{ width: 40, height: 5, borderRadius: 3, background: "#f0f0f0", overflow: "hidden" }}>
                                    <div style={{ height: "100%", borderRadius: 3, background: pctOfTotal > 30 ? "#DC2626" : pctOfTotal > 15 ? "#B45309" : "#047857", width: Math.min(pctOfTotal, 100) + "%" }} />
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: pctOfTotal > 30 ? "#DC2626" : "#888" }}>{fPct(pctOfTotal)}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Edit panel for socio */}
                  {props.isSocio && (
                    <div style={{ padding: "14px 16px", borderTop: "1px solid #f0f0f0", background: "#fff" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#B45309", marginBottom: 10 }}>EDITAR PRODUCTO</div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
                        {["Sala", "Uber Eats", "Glovo"].map(function(ch) {
                          var curPrice = p.prices ? (p.prices[ch] || 0) : 0;
                          return (
                            <div key={ch} style={{ minWidth: 90 }}>
                              <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>{ch}</div>
                              <input defaultValue={curPrice} onBlur={function(e) {
                                var v = parseFloat(e.target.value) || 0;
                                if (v === curPrice) return;
                                var newPrices = Object.assign({}, p.prices);
                                newPrices[ch] = v;
                                props.setProd(props.products.map(function(x) { return x.id === p.id ? Object.assign({}, x, { prices: newPrices }) : x; }));
                              }} style={{ width: "100%", padding: "6px 8px", border: "1.5px solid #e5e5e5", borderRadius: 6, fontSize: 13, textAlign: "right", fontFamily: "inherit", fontWeight: 600 }} type="number" step="0.05" />
                            </div>
                          );
                        })}
                        <div style={{ minWidth: 90 }}>
                          <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>Ventas/sem</div>
                          <input defaultValue={p.weekSales || 0} onBlur={function(e) {
                            var v = parseInt(e.target.value) || 0;
                            props.setProd(props.products.map(function(x) { return x.id === p.id ? Object.assign({}, x, { weekSales: v }) : x; }));
                          }} style={{ width: "100%", padding: "6px 8px", border: "1.5px solid #e5e5e5", borderRadius: 6, fontSize: 13, textAlign: "right", fontFamily: "inherit", fontWeight: 600 }} type="number" step="1" />
                        </div>
                        <button onClick={function() {
                          props.setProd(props.products.map(function(x) { return x.id === p.id ? Object.assign({}, x, { active: !x.active }) : x; }));
                        }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid " + (p.active ? "#DC2626" : "#047857"), background: p.active ? "#FEF2F2" : "#F0FDF4", color: p.active ? "#DC2626" : "#047857", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          {p.active ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====== SIMULATOR ====== */
function SimView(props) {
  var selIng = useState("");
  var pctChange = useState(0);
  var simMode = useState("pct");
  var manualPrice = useState("");
  var subName = useState("");
  var subPrice = useState("");
  var selectedId = selIng[0];
  var pct = pctChange[0];

  var selectedIngredient = null;
  for (var i = 0; i < props.ingredients.length; i++) {
    if (props.ingredients[i].id === selectedId) { selectedIngredient = props.ingredients[i]; break; }
  }

  // Calculate new cost per unit based on mode
  var newCostPerUnit = selectedIngredient ? selectedIngredient.costPerUnit : 0;
  var effectivePct = 0;
  if (selectedIngredient) {
    if (simMode[0] === "manual" && manualPrice[0] !== "") {
      newCostPerUnit = parseFloat(manualPrice[0]) || 0;
      effectivePct = selectedIngredient.costPerUnit > 0 ? ((newCostPerUnit - selectedIngredient.costPerUnit) / selectedIngredient.costPerUnit) * 100 : 0;
    } else if (simMode[0] === "sustitucion" && subPrice[0] !== "") {
      newCostPerUnit = parseFloat(subPrice[0]) || 0;
      effectivePct = selectedIngredient.costPerUnit > 0 ? ((newCostPerUnit - selectedIngredient.costPerUnit) / selectedIngredient.costPerUnit) * 100 : 0;
    } else {
      newCostPerUnit = selectedIngredient.costPerUnit * (1 + pct / 100);
      effectivePct = pct;
    }
  }

  // Find which products use this ingredient and calculate impact
  var affected = [];
  if (selectedIngredient && newCostPerUnit !== selectedIngredient.costPerUnit) {
    for (var j = 0; j < props.products.length; j++) {
      var p = props.products[j];
      if (!p.recipeId) continue;
      var rec = null;
      for (var k = 0; k < props.recipes.length; k++) { if (props.recipes[k].id === p.recipeId) { rec = props.recipes[k]; break; } }
      if (!rec) continue;
      var usesIngredient = false;
      var qtyUsed = 0;
      for (var m = 0; m < (rec.items || []).length; m++) {
        if (rec.items[m].refId === selectedId) { usesIngredient = true; qtyUsed = rec.items[m].qty || 0; break; }
      }
      if (!usesIngredient) continue;
      var currentCost = props.getPC(p);
      var costDiff = (newCostPerUnit - selectedIngredient.costPerUnit) * qtyUsed;
      var newCost = currentCost + costDiff;
      var sala = p.prices ? (p.prices.Sala || 0) : 0;
      var currentFC = sala > 0 ? (currentCost / sala) * 100 : 0;
      var newFC = sala > 0 ? (newCost / sala) * 100 : 0;
      affected.push({ name: p.name, category: p.category, currentCost: currentCost, newCost: newCost, currentFC: currentFC, newFC: newFC, diff: costDiff, sala: sala });
    }
    affected.sort(function(a, b) { return Math.abs(b.diff) - Math.abs(a.diff); });
  }

  // Count how many products each ingredient appears in
  var ingImpact = [];
  for (var ii = 0; ii < props.ingredients.length; ii++) {
    var ing = props.ingredients[ii];
    var count = 0;
    for (var jj = 0; jj < props.recipes.length; jj++) {
      for (var kk = 0; kk < (props.recipes[jj].items || []).length; kk++) {
        if (props.recipes[jj].items[kk].refId === ing.id) { count++; break; }
      }
    }
    if (count > 0) ingImpact.push({ id: ing.id, name: ing.name, costPerUnit: ing.costPerUnit, unit: ing.unit, count: count });
  }
  ingImpact.sort(function(a, b) { return b.count - a.count; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var inp = { padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Simulador de precios</div>
        <div style={{ fontSize: 13, color: "#888" }}>Cambia el precio de un ingrediente y ve como afecta a tus productos</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* Selector */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Selecciona ingrediente</div>
          <select value={selectedId} onChange={function(e) { selIng[1](e.target.value); pctChange[1](0); manualPrice[1](""); subName[1](""); subPrice[1](""); simMode[1]("pct"); }} style={{ ...inp, width: "100%", background: "#fff", marginBottom: 12 }}>
            <option value="">-- Elige ingrediente --</option>
            {ingImpact.map(function(i) { return <option key={i.id} value={i.id}>{i.name} ({fmt(i.costPerUnit)}/{i.unit}) - en {i.count} productos</option>; })}
          </select>

          {selectedIngredient && (
            <div>
              {/* Mode toggle */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <button onClick={function() { simMode[1]("pct"); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: simMode[0] === "pct" ? "2px solid #B45309" : "1px solid #e5e5e5", background: simMode[0] === "pct" ? "#B4530908" : "#fff", color: simMode[0] === "pct" ? "#B45309" : "#aaa", fontFamily: "inherit" }}>% Porcentaje</button>
                <button onClick={function() { simMode[1]("manual"); manualPrice[1](String(selectedIngredient.costPerUnit)); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: simMode[0] === "manual" ? "2px solid #B45309" : "1px solid #e5e5e5", background: simMode[0] === "manual" ? "#B4530908" : "#fff", color: simMode[0] === "manual" ? "#B45309" : "#aaa", fontFamily: "inherit" }}>Precio manual</button>
                <button onClick={function() { simMode[1]("sustitucion"); subName[1](""); subPrice[1](""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: simMode[0] === "sustitucion" ? "2px solid #047857" : "1px solid #e5e5e5", background: simMode[0] === "sustitucion" ? "#04785708" : "#fff", color: simMode[0] === "sustitucion" ? "#047857" : "#aaa", fontFamily: "inherit" }}>Sustitucion</button>
              </div>

              {simMode[0] === "pct" ? (
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Ajuste: <strong style={{ color: pct > 0 ? "#DC2626" : pct < 0 ? "#047857" : "#333" }}>{pct > 0 ? "+" : ""}{pct}%</strong></div>
                  <input type="range" min="-50" max="50" step="5" value={pct} onChange={function(e) { pctChange[1](parseInt(e.target.value)); }} style={{ width: "100%", marginBottom: 12 }} />
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[-20, -10, -5, 5, 10, 15, 20, 30].map(function(v) {
                      return <button key={v} onClick={function() { pctChange[1](v); }} style={{ padding: "5px 10px", borderRadius: 8, border: pct === v ? "2px solid #B45309" : "1px solid #e5e5e5", background: pct === v ? "#B4530910" : "#fff", color: pct === v ? "#B45309" : "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{v > 0 ? "+" : ""}{v}%</button>;
                    })}
                  </div>
                </div>
              ) : simMode[0] === "manual" ? (
                <div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Nuevo precio por {selectedIngredient.unit}:</div>
                  <input type="number" step="0.01" value={manualPrice[0]} onChange={function(e) { manualPrice[1](e.target.value); }} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 18, fontWeight: 700, textAlign: "center", boxSizing: "border-box", fontFamily: "inherit" }} placeholder={String(selectedIngredient.costPerUnit)} />
                  {effectivePct !== 0 && (
                    <div style={{ textAlign: "center", marginTop: 8, fontSize: 13, fontWeight: 700, color: effectivePct > 0 ? "#DC2626" : "#047857" }}>
                      {effectivePct > 0 ? "+" : ""}{effectivePct.toFixed(1)}% respecto al actual
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ padding: "12px 14px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #04785720", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#047857", marginBottom: 4 }}>SUSTITUIR INGREDIENTE</div>
                    <div style={{ fontSize: 12, color: "#666" }}>Actual: <strong>{selectedIngredient.name}</strong> a {fmt(selectedIngredient.costPerUnit)}/{selectedIngredient.unit}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>Aparece en {(function() { var c = 0; for (var ri = 0; ri < props.recipes.length; ri++) { for (var rj = 0; rj < (props.recipes[ri].items || []).length; rj++) { if (props.recipes[ri].items[rj].refId === selectedId) { c++; break; } } } return c; })()} productos</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Nombre del sustituto:</div>
                  <input value={subName[0]} onChange={function(e) { subName[1](e.target.value); }} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} placeholder={"Ej: " + selectedIngredient.name + " de otro proveedor"} />
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Precio por {selectedIngredient.unit}:</div>
                  <input type="number" step="0.01" value={subPrice[0]} onChange={function(e) { subPrice[1](e.target.value); }} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 18, fontWeight: 700, textAlign: "center", boxSizing: "border-box", fontFamily: "inherit" }} placeholder={String(selectedIngredient.costPerUnit)} />
                  {effectivePct !== 0 && (
                    <div style={{ textAlign: "center", marginTop: 10, padding: "10px 14px", borderRadius: 10, background: effectivePct < 0 ? "#F0FDF4" : "#FEF2F2" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: effectivePct < 0 ? "#047857" : "#DC2626" }}>
                        {effectivePct < 0 ? "AHORRAS " + fPct(Math.abs(effectivePct)) : "SUBE " + fPct(effectivePct)}
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{fmt(selectedIngredient.costPerUnit)}/{selectedIngredient.unit} → {fmt(newCostPerUnit)}/{selectedIngredient.unit}{subName[0] ? " (" + subName[0] + ")" : ""}</div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#f9f9f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#888" }}>Precio actual:</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(selectedIngredient.costPerUnit)}/{selectedIngredient.unit}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{simMode[0] === "sustitucion" && subName[0] ? subName[0] + ":" : "Precio simulado:"}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: newCostPerUnit > selectedIngredient.costPerUnit ? "#DC2626" : newCostPerUnit < selectedIngredient.costPerUnit ? "#047857" : "#333" }}>{fmt(newCostPerUnit)}/{selectedIngredient.unit}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Impacto */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Impacto en productos {affected.length > 0 ? "(" + affected.length + " afectados)" : ""}</div>
          {!selectedIngredient && <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>Selecciona un ingrediente para ver el impacto</div>}
          {selectedIngredient && newCostPerUnit === selectedIngredient.costPerUnit && <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>{simMode[0] === "pct" ? "Mueve el slider para simular un cambio de precio" : simMode[0] === "sustitucion" ? "Introduce el precio del sustituto para ver el impacto" : "Cambia el precio para ver el impacto"}</div>}
          {affected.length > 0 && newCostPerUnit !== selectedIngredient.costPerUnit && affected.map(function(a) {
            var fcDiff = a.newFC - a.currentFC;
            return (
              <div key={a.name} style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div><span style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</span><span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{a.category}</span></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: fcDiff > 0 ? "#DC2626" : "#047857" }}>{fcDiff > 0 ? "+" : ""}{fcDiff.toFixed(1)}% FC</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888" }}>
                  <span>Coste: {fmt(a.currentCost)} -&gt; <strong style={{ color: effectivePct > 0 ? "#DC2626" : "#047857" }}>{fmt(a.newCost)}</strong></span>
                  <span>FC: {fPct(a.currentFC)} -&gt; <strong style={{ color: a.newFC > 35 ? "#DC2626" : "#333" }}>{fPct(a.newFC)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ingredientes criticos */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Ingredientes criticos</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Los que aparecen en mas productos - mayor riesgo si sube el precio</div>
          {ingImpact.slice(0, 15).map(function(i, idx) {
            return (
              <div key={i.id} onClick={function() { selIng[1](i.id); pctChange[1](10); simMode[1]("pct"); manualPrice[1](""); subName[1](""); subPrice[1](""); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 8, cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: idx < 3 ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: idx < 3 ? "#B45309" : "#bbb", flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(i.costPerUnit)}/{i.unit}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#B45309" }}>en {i.count} prod.</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ====== PROMOS ====== */
function PromoView(props) {
  var promoType = useState("pct");
  var promoVal = useState(20);
  var chS = useState("sala");
  var type = promoType[0];
  var val = promoVal[0];
  var isDel = chS[0] === "delivery";
  var chLabel = isDel ? "Delivery" : "Sala";

  var promoTypes = [
    { k: "pct", l: "% Descuento" },
    { k: "2x1", l: "2x1" },
    { k: "fixed", l: "Precio fijo" },
    { k: "happy", l: "Happy Hour" },
  ];

  // Classify product types
  var typeMap = { "Burritos": "Principal", "Bowls": "Principal", "Tacos": "Principal", "Quesadillas": "Principal", "Nachos": "Entrante", "Extras": "Entrante" };
  var results = [];
  for (var i = 0; i < props.products.length; i++) {
    var p = props.products[i];
    var cost = props.getPC(p);
    var sala = p.prices ? (p.prices.Sala || 0) : 0;
    var del = p.prices ? (p.prices["Uber Eats"] || 0) : 0;
    var pvp = isDel ? del : sala;
    if (pvp <= 0) continue;
    var fc = (cost / pvp) * 100;
    var margin = pvp - cost;

    var promoPvp = pvp;
    if (type === "pct") { promoPvp = pvp * (1 - val / 100); }
    else if (type === "2x1") { promoPvp = pvp / 2; }
    else if (type === "fixed") { promoPvp = val; }
    else if (type === "happy") { promoPvp = pvp * (1 - val / 100); }

    var promoFC = promoPvp > 0 ? (cost / promoPvp) * 100 : 0;
    var promoMargin = promoPvp - cost;
    var viable = promoFC < 45 && promoMargin > 1;
    var risk = promoFC >= 45 || promoMargin <= 1;
    var prodType = typeMap[p.category] || "Otro";

    results.push({ id: p.id, name: p.name, category: p.category, prodType: prodType, cost: cost, pvp: pvp, fc: fc, margin: margin, promoPvp: promoPvp, promoFC: promoFC, promoMargin: promoMargin, viable: viable, risk: risk, weekSales: p.weekSales || 0 });
  }

  var viableCount = 0;
  var riskCount = 0;
  for (var v = 0; v < results.length; v++) { if (results[v].viable) viableCount++; if (results[v].risk) riskCount++; }

  results.sort(function(a, b) { return a.promoFC - b.promoFC; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Promociones</div>
        <div style={{ fontSize: 13, color: "#888" }}>Simula promociones y ve que productos las aguantan sin perder dinero</div>
      </div>

      {/* Channel + promo type */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
        <div style={{ flex: 1 }} />
        {promoTypes.map(function(t) {
          var active = type === t.k;
          return <button key={t.k} onClick={function() { promoType[1](t.k); }} style={{ padding: "8px 16px", borderRadius: 10, border: active ? "2px solid #7C3AED" : "1px solid #e5e5e5", background: active ? "#7C3AED08" : "#fff", color: active ? "#7C3AED" : "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.l}</button>;
        })}
      </div>

      {/* Value control */}
      <div style={{ ...crd, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>
            {type === "fixed" ? "Precio fijo:" : "Descuento:"}
          </div>
          {type === "fixed" ? (
            <input type="number" value={val} onChange={function(e) { promoVal[1](parseFloat(e.target.value) || 0); }} style={{ padding: "8px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, width: 100, fontSize: 14, textAlign: "right", fontFamily: "inherit" }} step="0.5" min="0" />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <input type="range" min="5" max="50" step="5" value={val} onChange={function(e) { promoVal[1](parseInt(e.target.value)); }} style={{ flex: 1 }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#7C3AED", minWidth: 50, textAlign: "right" }}>{val}%</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center", padding: "4px 12px", borderRadius: 8, background: "#F0FDF4" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#047857" }}>{viableCount}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Viables</div>
            </div>
            <div style={{ textAlign: "center", padding: "4px 12px", borderRadius: 8, background: riskCount > 0 ? "#FEF2F2" : "#F0FDF4" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: riskCount > 0 ? "#DC2626" : "#047857" }}>{riskCount}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Riesgo</div>
            </div>
          </div>
        </div>
      </div>

      {/* BEST CANDIDATES - by product type */}
      {(function() {
        var bestMain = results.filter(function(r) { return r.viable && r.prodType === "Principal"; }).slice(0, 6);
        var bestEntry = results.filter(function(r) { return r.viable && r.prodType === "Entrante"; }).slice(0, 6);
        var worst = results.filter(function(r) { return r.risk; });
        if (results.length === 0) return null;

        function RenderBestRow(r, idx) {
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", marginBottom: 4, borderRadius: 10, background: "rgba(255,255,255,0.1)" }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{idx + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{r.category} | {r.weekSales} ventas/sem | {fmt(r.pvp)} -&gt; {fmt(r.promoPvp)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{fmt(r.promoMargin)}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>FC {fPct(r.promoFC)}</div>
              </div>
            </div>
          );
        }

        // Strategic tip based on promo type
        var tip = "";
        if (type === "pct") tip = "Consejo: promociona 1-2 principales con margen alto para atraer, complementa con entrantes como gancho a precio normal.";
        if (type === "2x1") tip = "Consejo: 2x1 funciona mejor en principales (burritos, bowls) para parejas. Evita en entrantes que ya se comparten.";
        if (type === "fixed") tip = "Consejo: precio fijo funciona bien en entrantes como reclamo. Usa un principal estrella + entrante a precio fijo.";
        if (type === "happy") tip = "Consejo: happy hour ideal para extras y entrantes. Los principales mantienen precio; el ahorro en entrantes genera ticket medio mayor.";

        return (
          <div style={{ marginBottom: 20 }}>
            {/* Strategic tip */}
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "#7C3AED10", borderLeft: "3px solid #7C3AED", marginBottom: 12, fontSize: 13, color: "#5B21B6", fontWeight: 500 }}>{tip}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {/* Best Principales */}
              <div style={{ background: "linear-gradient(135deg, #047857 0%, #065F46 100%)", borderRadius: 14, padding: 20, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>🌮</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>PRINCIPALES</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>Burritos, Bowls, Tacos, Quesadillas</div>
                  </div>
                </div>
                {bestMain.length === 0 && <div style={{ padding: 8, fontSize: 12, opacity: 0.7 }}>Ningun principal viable a este descuento</div>}
                {bestMain.map(function(r, idx) { return RenderBestRow(r, idx); })}
              </div>

              {/* Best Entrantes */}
              <div style={{ background: "linear-gradient(135deg, #1E40AF 0%, #1E3A5F 100%)", borderRadius: 14, padding: 20, color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>🧀</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>ENTRANTES / EXTRAS</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>Nachos, Bacon Cheese, Alitas</div>
                  </div>
                </div>
                {bestEntry.length === 0 && <div style={{ padding: 8, fontSize: 12, opacity: 0.7 }}>Ningun entrante viable a este descuento</div>}
                {bestEntry.map(function(r, idx) { return RenderBestRow(r, idx); })}
              </div>

              {/* NO PROMOCIONAR */}
              {worst.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eee", borderLeft: "4px solid #DC2626" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 18 }}>&#9888;</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>NO PROMOCIONAR</div>
                      <div style={{ fontSize: 12, color: "#888" }}>Pierden dinero o margen insuficiente</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 20, fontWeight: 800, color: "#DC2626" }}>{worst.length}</div>
                  </div>
                  {worst.slice(0, 5).map(function(r) {
                    return (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B" }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>{r.category} ({r.prodType})</div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626" }}>FC {fPct(r.promoFC)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Results table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0", background: "#fafaf8", fontSize: 12, color: "#888" }}>
          Precios {chLabel} | Promo: {type === "pct" ? "-" + val + "%" : type === "2x1" ? "2x1" : type === "fixed" ? fmt(val) + " fijo" : "-" + val + "% Happy Hour"}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: "2px solid #f0f0f0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>PRODUCTO</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>PVP {chLabel.toUpperCase()}</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>PVP PROMO</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>FC NORMAL</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>FC PROMO</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>MARGEN PROMO</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}></th>
            </tr></thead>
            <tbody>
              {results.map(function(r) {
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f5f5f5", background: r.risk ? "#FEF2F208" : "transparent" }}>
                    <td style={{ padding: "10px 14px" }}><div style={{ fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: "#aaa" }}>{r.category}</div></td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{fmt(r.pvp)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: "#7C3AED" }}>{fmt(r.promoPvp)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{fPct(r.fc)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: r.promoFC > 45 ? "#DC2626" : r.promoFC > 35 ? "#D97706" : "#047857" }}>{fPct(r.promoFC)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: r.promoMargin > 3 ? "#047857" : r.promoMargin > 0 ? "#D97706" : "#DC2626" }}>{fmt(r.promoMargin)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}><Pill t={r.viable ? "OK" : "RIESGO"} c={r.viable ? "#047857" : "#DC2626"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ====== COMBOS ====== */
function ComboView(props) {
  var comboItems = useState([]);
  var comboPrice = useState("");
  var chS = useState("sala");
  var isDel = chS[0] === "delivery";
  var chLabel = isDel ? "Delivery" : "Sala";
  var items = comboItems[0];
  var price = parseFloat(comboPrice[0]) || 0;

  var addItem = function(prodId) {
    var already = false;
    for (var i = 0; i < items.length; i++) { if (items[i] === prodId) { already = true; break; } }
    if (!already) comboItems[1](items.concat([prodId]));
  };
  var removeItem = function(idx) {
    var next = [];
    for (var i = 0; i < items.length; i++) { if (i !== idx) next.push(items[i]); }
    comboItems[1](next);
  };

  function getPvp(p) { return isDel ? (p.prices ? p.prices["Uber Eats"] || 0 : 0) : (p.prices ? p.prices.Sala || 0 : 0); }

  // Calculate combo stats
  var totalCost = 0;
  var totalIndividual = 0;
  var comboProducts = [];
  for (var i = 0; i < items.length; i++) {
    for (var j = 0; j < props.products.length; j++) {
      if (props.products[j].id === items[i]) {
        var p = props.products[j];
        var cost = props.getPC(p);
        var pvp = getPvp(p);
        totalCost += cost;
        totalIndividual += pvp;
        comboProducts.push({ id: p.id, name: p.name, category: p.category, cost: cost, pvp: pvp });
        break;
      }
    }
  }

  var comboFC = price > 0 ? (totalCost / price) * 100 : 0;
  var comboMargin = price > 0 ? price - totalCost : 0;
  var savings = totalIndividual > 0 && price > 0 ? totalIndividual - price : 0;
  var savingsPct = totalIndividual > 0 && price > 0 ? (savings / totalIndividual) * 100 : 0;

  // Suggest optimal combos
  var suggestions = [];
  for (var si = 0; si < props.products.length; si++) {
    var sp = props.products[si];
    var sCost = props.getPC(sp);
    var sSala = sp.prices ? (sp.prices.Sala || 0) : 0;
    var sFC = sSala > 0 ? (sCost / sSala) * 100 : 0;
    if (sFC < 25 && sSala > 5) {
      suggestions.push({ id: sp.id, name: sp.name, category: sp.category, fc: sFC, margin: sSala - sCost, sala: sSala });
    }
  }
  suggestions.sort(function(a, b) { return a.fc - b.fc; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Combos</div>
        <div style={{ fontSize: 13, color: "#888" }}>Crea combinaciones de productos - precios {chLabel}</div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* Combo Builder */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Arma tu combo</div>
          <select onChange={function(e) { if (e.target.value) addItem(e.target.value); e.target.value = ""; }} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", background: "#fff", marginBottom: 12 }}>
            <option value="">+ Agregar producto al combo</option>
            {props.products.map(function(p) { var s = getPvp(p); return <option key={p.id} value={p.id}>{p.name} ({p.category}) - {fmt(s)}</option>; })}
          </select>

          {comboProducts.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>Agrega productos para armar el combo</div>}

          {comboProducts.map(function(cp, idx) {
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{cp.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{cp.category} | Coste {fmt(cp.cost)} | PVP {fmt(cp.pvp)}</div>
                </div>
                <button onClick={function() { removeItem(idx); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, fontFamily: "inherit" }}>x</button>
              </div>
            );
          })}

          {comboProducts.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>PRECIO DEL COMBO</div>
              <input type="number" value={comboPrice[0]} onChange={function(e) { comboPrice[1](e.target.value); }} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 16, boxSizing: "border-box", fontFamily: "inherit", fontWeight: 700, textAlign: "center" }} step="0.5" min="0" placeholder="Ej: 12.90" />
            </div>
          )}
        </div>

        {/* Combo Results */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Resultado del combo</div>

          {comboProducts.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>Arma un combo para ver los numeros</div>}

          {comboProducts.length > 0 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 14, borderRadius: 10, background: "#f9f9f6", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>COSTE TOTAL MP</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(totalCost)}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: "#f9f9f6", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>PVP INDIVIDUAL</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(totalIndividual)}</div>
                </div>
              </div>

              {price > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 14, borderRadius: 10, background: comboFC > 35 ? "#FEF2F2" : "#F0FDF4", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>FC COMBO</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: comboFC > 35 ? "#DC2626" : comboFC > 30 ? "#D97706" : "#047857" }}>{fPct(comboFC)}</div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 10, background: "#F0FDF4", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>MARGEN</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: comboMargin > 0 ? "#047857" : "#DC2626" }}>{fmt(comboMargin)}</div>
                  </div>
                  <div style={{ padding: 14, borderRadius: 10, background: "#EFF6FF", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>AHORRO CLIENTE</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#1E40AF" }}>{fPct(savingsPct)}</div>
                  </div>
                </div>
              )}

              {price > 0 && comboFC > 35 && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", borderLeft: "3px solid #DC2626", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B" }}>Food cost alto</div>
                  <div style={{ fontSize: 11, color: "#DC2626" }}>Sube el precio del combo o quita el producto mas caro para mejorar el margen</div>
                </div>
              )}
              {price > 0 && comboFC <= 30 && savingsPct >= 10 && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#F0FDF4", borderLeft: "3px solid #047857", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#065F46" }}>Combo viable</div>
                  <div style={{ fontSize: 11, color: "#047857" }}>Buen FC y el cliente ahorra {fPct(savingsPct)} respecto a comprar por separado</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Smart Combo Suggestions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(function() {
            // Build product lookup by category with costs
            var byCategory = {};
            var allP = [];
            for (var ci = 0; ci < props.products.length; ci++) {
              var cp = props.products[ci];
              var cc = props.getPC(cp);
              var cs = getPvp(cp);
              if (cs <= 0) continue;
              var cfc = (cc / cs) * 100;
              var obj = { id: cp.id, name: cp.name, category: cp.category, cost: cc, sala: cs, fc: cfc, margin: cs - cc, weekSales: cp.weekSales || 0 };
              allP.push(obj);
              if (!byCategory[cp.category]) byCategory[cp.category] = [];
              byCategory[cp.category].push(obj);
            }
            // Sort each category by margin desc
            for (var ck in byCategory) byCategory[ck].sort(function(a, b) { return b.margin - a.margin; });

            var principales = (byCategory["Burritos"] || []).concat(byCategory["Bowls"] || []).concat(byCategory["Quesadillas"] || []);
            var entrantes = (byCategory["Nachos"] || []).concat(byCategory["Extras"] || []);
            var tacos = byCategory["Tacos"] || [];
            principales.sort(function(a, b) { return b.margin - a.margin; });
            entrantes.sort(function(a, b) { return b.margin - a.margin; });
            tacos.sort(function(a, b) { return b.margin - a.margin; });

            // Generate smart combos
            var combos = [];

            // SOLO - 1 principal + 1 entrante
            if (principales.length >= 1 && entrantes.length >= 1) {
              var p1 = principales[0]; var e1 = entrantes[0];
              var sc = p1.cost + e1.cost; var si = p1.sala + e1.sala; var sp = Math.round((si * 0.85) * 2) / 2;
              combos.push({ type: "solo", emoji: "🧑", label: "Combo Individual", desc: "1 Principal + 1 Entrante", items: [p1.name + " (" + fmt(p1.sala) + ")", e1.name + " (" + fmt(e1.sala) + ")"], cost: sc, individual: si, suggested: sp, fc: sp > 0 ? (sc / sp) * 100 : 0, saving: si > 0 ? ((si - sp) / si * 100) : 0, tip: "El mas vendido. Principal de alto margen + entrante para compartir o picar." });
            }
            // PAREJA - 2 principales + 1 entrante para compartir
            if (principales.length >= 2 && entrantes.length >= 1) {
              var pa = principales[0]; var pb = principales[1]; var pe = entrantes[0];
              var sc2 = pa.cost + pb.cost + pe.cost; var si2 = pa.sala + pb.sala + pe.sala; var sp2 = Math.round((si2 * 0.82) * 2) / 2;
              combos.push({ type: "pareja", emoji: "👫", label: "Combo Pareja", desc: "2 Principales + 1 Entrante", items: [pa.name + " (" + fmt(pa.sala) + ")", pb.name + " (" + fmt(pb.sala) + ")", pe.name + " para compartir (" + fmt(pe.sala) + ")"], cost: sc2, individual: si2, suggested: sp2, fc: sp2 > 0 ? (sc2 / sp2) * 100 : 0, saving: si2 > 0 ? ((si2 - sp2) / si2 * 100) : 0, tip: "Dos principales diferentes + nachos para compartir. Ahorro atractivo para parejas." });
            }
            // TACOS PACK - 3 tacos variados
            if (tacos.length >= 3) {
              var t1 = tacos[0]; var t2 = tacos[1]; var t3 = tacos[2];
              var sc3 = (t1.cost + t2.cost + t3.cost) * 3; var si3 = (t1.sala + t2.sala + t3.sala) * 3; var sp3 = Math.round(si3 * 0.88 * 2) / 2;
              combos.push({ type: "tacos", emoji: "🌮", label: "Pack Tacos x3 Variados", desc: "3 Tacos mix (9 uds total)", items: ["3x " + t1.name, "3x " + t2.name, "3x " + t3.name], cost: sc3, individual: si3, suggested: sp3, fc: sp3 > 0 ? (sc3 / sp3) * 100 : 0, saving: si3 > 0 ? ((si3 - sp3) / si3 * 100) : 0, tip: "Pack variado para probar. Ideal para delivery: totopos + 3 sabores." });
            }
            // GRUPO - 3 principales + 2 entrantes
            if (principales.length >= 3 && entrantes.length >= 2) {
              var ga = principales[0]; var gb = principales[1]; var gc = principales[2]; var ge1 = entrantes[0]; var ge2 = entrantes.length > 1 ? entrantes[1] : entrantes[0];
              var sc4 = ga.cost + gb.cost + gc.cost + ge1.cost + ge2.cost; var si4 = ga.sala + gb.sala + gc.sala + ge1.sala + ge2.sala; var sp4 = Math.round((si4 * 0.80) * 2) / 2;
              combos.push({ type: "grupo", emoji: "👨‍👩‍👧‍👦", label: "Combo Grupo / Familia", desc: "3 Principales + 2 Entrantes", items: [ga.name, gb.name, gc.name, ge1.name, ge2.name], cost: sc4, individual: si4, suggested: sp4, fc: sp4 > 0 ? (sc4 / sp4) * 100 : 0, saving: si4 > 0 ? ((si4 - sp4) / si4 * 100) : 0, tip: "Para 3-4 personas. Descuento agresivo (20%) pero alto volumen. Ideal fines de semana." });
            }
            // ENTRANTES PARA COMPARTIR - 2 entrantes
            if (entrantes.length >= 2) {
              var ea = entrantes[0]; var eb = entrantes[1];
              var sc5 = ea.cost + eb.cost; var si5 = ea.sala + eb.sala; var sp5 = Math.round((si5 * 0.87) * 2) / 2;
              combos.push({ type: "picar", emoji: "🍟", label: "Combo Para Picar", desc: "2 Entrantes para compartir", items: [ea.name + " (" + fmt(ea.sala) + ")", eb.name + " (" + fmt(eb.sala) + ")"], cost: sc5, individual: si5, suggested: sp5, fc: sp5 > 0 ? (sc5 / sp5) * 100 : 0, saving: si5 > 0 ? ((si5 - sp5) / si5 * 100) : 0, tip: "Ideal como acompanamiento a cervezas o como entrante antes de principales." });
            }

            return combos.map(function(combo) {
              return (
                <div key={combo.type} style={{ ...crd, borderLeft: "4px solid " + (combo.fc > 35 ? "#D97706" : "#047857") }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{combo.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{combo.label}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{combo.desc}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#B45309" }}>{fmt(combo.suggested)}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>Sugerido</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {combo.items.map(function(it, idx) {
                      return <span key={idx} style={{ padding: "4px 12px", borderRadius: 6, background: "#f5f5f5", fontSize: 12, fontWeight: 500 }}>{it}</span>;
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fafaf8", fontSize: 12, flex: 1, textAlign: "center" }}>
                      <div style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>COSTE MP</div>
                      <div style={{ fontWeight: 700 }}>{fmt(combo.cost)}</div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: "#fafaf8", fontSize: 12, flex: 1, textAlign: "center" }}>
                      <div style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>PVP SEPARADO</div>
                      <div style={{ fontWeight: 700 }}>{fmt(combo.individual)}</div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: combo.fc > 35 ? "#FEF2F2" : "#F0FDF4", fontSize: 12, flex: 1, textAlign: "center" }}>
                      <div style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>FC COMBO</div>
                      <div style={{ fontWeight: 700, color: combo.fc > 35 ? "#DC2626" : "#047857" }}>{fPct(combo.fc)}</div>
                    </div>
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: "#EFF6FF", fontSize: 12, flex: 1, textAlign: "center" }}>
                      <div style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>AHORRO</div>
                      <div style={{ fontWeight: 700, color: "#1E40AF" }}>-{fPct(combo.saving)}</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "#FFFBEB", borderLeft: "3px solid #D97706", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>{combo.tip}</div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}


/* ====== PRICING ====== */
function PricingView(props) {
  var chS = useState("sala");
  var isDel = chS[0] === "delivery";

  // Round to nearest 0.05
  function roundPrice(n) {
    return Math.ceil(n * 20) / 20;
  }

  var data = [];
  for (var i = 0; i < props.products.length; i++) {
    var p = props.products[i];
    var cost = props.getPC(p);
    var sala = p.prices ? (p.prices.Sala || 0) : 0;
    var del = p.prices ? (p.prices["Uber Eats"] || 0) : 0;
    var pvp = isDel ? del : sala;
    var fc = pvp > 0 ? (cost / pvp) * 100 : 0;
    var margin = pvp > 0 ? pvp - cost : 0;

    // Smart recommendation: target FC 30% for optimal balance
    var idealPrice = roundPrice(cost / 0.30);
    var minPrice = roundPrice(cost / 0.35);
    var diff = pvp > 0 ? idealPrice - pvp : 0;

    // Status
    var status = "ok";
    var action = "Precio correcto";
    var recPrice = pvp;
    if (fc > 45) {
      status = "critical";
      action = "URGENTE: pierdes dinero";
      recPrice = idealPrice;
    } else if (fc > 35) {
      status = "high";
      action = "Subir precio";
      recPrice = idealPrice;
    } else if (fc > 32) {
      status = "watch";
      action = "Ligeramente bajo";
      recPrice = idealPrice;
    } else if (fc >= 25) {
      status = "ok";
      action = "Buen precio";
      recPrice = pvp;
    } else if (fc > 0 && fc < 20) {
      status = "premium";
      action = "Margen alto - ideal para promos";
      recPrice = pvp;
    } else if (fc >= 20 && fc < 25) {
      status = "good";
      action = "Excelente margen";
      recPrice = pvp;
    }

    var gapEur = del - sala;
    var gapPct = sala > 0 ? ((del - sala) / sala) * 100 : 0;

    data.push({
      id: p.id, name: p.name, category: p.category, cost: cost,
      sala: sala, del: del, pvp: pvp, fc: fc, margin: margin,
      idealPrice: idealPrice, minPrice: minPrice, recPrice: recPrice,
      diff: diff, status: status, action: action,
      gapEur: gapEur, gapPct: gapPct
    });
  }

  // Split into action groups
  var urgent = data.filter(function(p) { return p.status === "critical"; });
  var needsUp = data.filter(function(p) { return p.status === "high" || p.status === "watch"; });
  var goodPrice = data.filter(function(p) { return p.status === "ok" || p.status === "good"; });
  var promoReady = data.filter(function(p) { return p.status === "premium" || p.status === "good"; });
  var noGap = data.filter(function(p) { return p.sala > 0 && p.del > 0 && p.gapPct < 3; });

  urgent.sort(function(a, b) { return b.fc - a.fc; });
  needsUp.sort(function(a, b) { return b.fc - a.fc; });
  promoReady.sort(function(a, b) { return a.fc - b.fc; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  // Status colors and labels
  function statusColor(s) {
    if (s === "critical") return "#DC2626";
    if (s === "high") return "#D97706";
    if (s === "watch") return "#B45309";
    if (s === "good" || s === "premium") return "#047857";
    return "#555";
  }
  function statusBg(s) {
    if (s === "critical") return "#FEF2F2";
    if (s === "high") return "#FFFBEB";
    if (s === "watch") return "#FFF7ED";
    return "transparent";
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Precios</div>
        <div style={{ fontSize: 13, color: "#888" }}>Recomendaciones automaticas basadas en tus costes reales</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 10, background: urgent.length > 0 ? "#FEF2F2" : "#F0FDF4" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: urgent.length > 0 ? "#DC2626" : "#047857" }}>{urgent.length}</div>
            <div style={{ fontSize: 10, color: "#888" }}>Urgente</div>
          </div>
          <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 10, background: needsUp.length > 0 ? "#FFFBEB" : "#F0FDF4" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: needsUp.length > 0 ? "#D97706" : "#047857" }}>{needsUp.length}</div>
            <div style={{ fontSize: 10, color: "#888" }}>Revisar</div>
          </div>
          <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 10, background: "#F0FDF4" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#047857" }}>{goodPrice.length}</div>
            <div style={{ fontSize: 10, color: "#888" }}>OK</div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div style={{ ...crd, marginBottom: 20, padding: 16, background: "linear-gradient(135deg, #1a1a1a 0%, #2d1f0e 100%)", color: "#fff", borderRadius: 14 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#999", fontWeight: 600, letterSpacing: 1 }}>REVISION DE PRECIOS - {isDel ? "DELIVERY" : "SALA"}</div>
            <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
              {(function() {
                var lostMargin = 0;
                var gainIfFixed = 0;
                for (var ri = 0; ri < data.length; ri++) {
                  var rd = data[ri];
                  if (rd.status === "critical" || rd.status === "high") {
                    gainIfFixed += (rd.recPrice - rd.pvp) * (rd.weekSales || 0);
                  }
                }
                return urgent.length + needsUp.length > 0
                  ? "Ajustando precios puedes ganar ~" + fmt(gainIfFixed) + "/semana extra"
                  : "Todos los precios estan en rango saludable";
              })()}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: urgent.length > 0 ? "#EF4444" : "#4ADE80" }}>{urgent.length}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Criticos</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: needsUp.length > 0 ? "#FBBF24" : "#4ADE80" }}>{needsUp.length}</div>
              <div style={{ fontSize: 10, color: "#888" }}>A revisar</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#4ADE80" }}>{goodPrice.length}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Correctos</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#60A5FA" }}>{promoReady.length}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Promo</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABLE - all products with recommendations */}
      <div style={{ ...crd, padding: 0, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafaf8" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Todos los productos - {isDel ? "Delivery" : "Sala"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>Precio ideal calculado para FC 30% (punto optimo rentabilidad)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: "2px solid #f0f0f0" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>PRODUCTO</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>COSTE MP</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>PVP ACTUAL</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}>FC ACTUAL</th>
              <th style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>PVP IDEAL</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}>CAMBIO</th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>ACCION</th>
            </tr></thead>
            <tbody>
              {data.filter(function(p) { return p.pvp > 0; }).sort(function(a, b) { return b.fc - a.fc; }).map(function(p) {
                var sc = statusColor(p.status);
                var sb = statusBg(p.status);
                var needsChange = p.status === "critical" || p.status === "high" || p.status === "watch";
                var changeAmt = needsChange ? p.recPrice - p.pvp : 0;
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", background: sb }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", color: "#888" }}>{fmt(p.cost)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>{fmt(p.pvp)}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: sc + "15", color: sc }}>{fPct(p.fc)}</span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, fontSize: 15, color: needsChange ? sc : "#333" }}>
                      {needsChange ? fmt(p.recPrice) : fmt(p.pvp)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      {needsChange ? (
                        <span style={{ fontSize: 12, fontWeight: 700, color: sc }}>+{changeAmt.toFixed(2)} E</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#ccc" }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: sc }}>{p.action}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>

        {/* URGENT ACTIONS */}
        {urgent.length > 0 && (
          <div style={{ ...crd, borderLeft: "4px solid #DC2626" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>ACCION URGENTE</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Estos productos pierden dinero o tienen margen peligroso</div>
            {urgent.map(function(p) {
              return (
                <div key={p.id} style={{ padding: "14px", marginBottom: 8, borderRadius: 12, background: "#FEF2F2" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>{p.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#DC2626" }}>FC {fPct(p.fc)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <div style={{ padding: "6px 14px", borderRadius: 8, background: "#fff", border: "1px solid #e5e5e5" }}>
                      <div style={{ fontSize: 10, color: "#888" }}>Actual</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(p.pvp)}</div>
                    </div>
                    <div style={{ fontSize: 18, color: "#DC2626" }}>&rarr;</div>
                    <div style={{ padding: "6px 14px", borderRadius: 8, background: "#DC262610", border: "2px solid #DC2626" }}>
                      <div style={{ fontSize: 10, color: "#DC2626" }}>Subir a</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#DC2626" }}>{fmt(p.recPrice)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#888" }}>Nuevo FC</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#047857" }}>{fPct((p.cost / p.recPrice) * 100)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>Coste MP: {fmt(p.cost)} | Margen actual: {fmt(p.margin)} | Nuevo margen: {fmt(p.recPrice - p.cost)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* DELIVERY GAP */}
        {noGap.length > 0 && (
          <div style={{ ...crd, borderLeft: "4px solid #7C3AED" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 4 }}>SIN MARKUP EN DELIVERY</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Mismo precio en sala y delivery - pierdes comision de plataforma</div>
            {noGap.map(function(p) {
              var sugDel = roundPrice(p.sala * 1.12);
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>Sala {fmt(p.sala)} = Delivery {fmt(p.del)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>Subir delivery a</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#7C3AED" }}>{fmt(sugDel)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROMO READY */}
        {promoReady.length > 0 && (
          <div style={{ ...crd, borderLeft: "4px solid #047857" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#047857", marginBottom: 4 }}>LISTOS PARA PROMOCION</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Tanto margen que aguantan descuentos agresivos</div>
            {promoReady.slice(0, 10).map(function(p) {
              var maxDiscount = Math.floor((1 - (p.cost / p.pvp) / 0.35) * 100);
              if (maxDiscount < 0) maxDiscount = 0;
              if (maxDiscount > 50) maxDiscount = 50;
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>FC {fPct(p.fc)} | Margen {fmt(p.margin)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#047857" }}>hasta -{maxDiscount}%</div>
                    <div style={{ fontSize: 11, color: "#888" }}>sin bajar de FC 35%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CATEGORY OVERVIEW */}
        <div style={crd}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF", marginBottom: 12 }}>POR CATEGORIA ({isDel ? "Delivery" : "Sala"})</div>
          {(function() {
            var cats = {};
            for (var c = 0; c < data.length; c++) {
              var d = data[c];
              if (d.pvp <= 0) continue;
              if (!cats[d.category]) cats[d.category] = { n: 0, fc: 0, mg: 0, pvp: 0, cost: 0 };
              cats[d.category].n++;
              cats[d.category].fc += d.fc;
              cats[d.category].mg += d.margin;
              cats[d.category].pvp += d.pvp;
              cats[d.category].cost += d.cost;
            }
            var list = [];
            for (var k in cats) list.push({ name: k, n: cats[k].n, avgFC: cats[k].fc / cats[k].n, avgMg: cats[k].mg / cats[k].n, avgPvp: cats[k].pvp / cats[k].n });
            list.sort(function(a, b) { return b.avgMg - a.avgMg; });
            return list.map(function(c) {
              var fcC = c.avgFC > 35 ? "#DC2626" : c.avgFC > 30 ? "#D97706" : "#047857";
              return (
                <div key={c.name} style={{ padding: "12px 8px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div><span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span><span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{c.n} prod.</span></div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: fcC }}>{fPct(c.avgFC)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888" }}>
                    <span>PVP medio <strong style={{ color: "#333" }}>{fmt(c.avgPvp)}</strong></span>
                    <span>Margen <strong style={{ color: "#047857" }}>{fmt(c.avgMg)}</strong></span>
                  </div>
                  <div style={{ marginTop: 6, height: 5, borderRadius: 3, background: "#f0f0f0" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: Math.min(c.avgFC, 60) / 60 * 100 + "%", background: fcC }} />
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

/* ====== PREP STEPS DATA ====== */
var PREP_STEPS = {
  "rb01": ["Cocer arroz bayo y enfriar","Saltear Heura con especias mexicanas 3min","Calentar frijoles negros","Preparar pico de gallo y guacamole fresco","Extender tortilla 30cm, capa de arroz, Heura, frijoles","Anadir pico de gallo, guacamole, lechuga, salsa verde","Enrollar apretado, cortar diagonal, envolver en aluminio"],
  "rb02": ["Cocer arroz bayo","Saltear carne picada con chipotle molido hasta dorar","Calentar frijoles y salsa cheddar USA","Tortilla 30cm: arroz, carne, chipotle, frijoles, cheddar","Anadir pico de gallo, guacamole, lechuga, salsa verde","Enrollar firme, cortar y envolver"],
  "rb03": ["Cocer arroz bayo","Calentar pulled pork BBQ (R2R)","Tortilla: arroz, pulled pork, nata agria, pico, guacamole","Anadir totopos, lechuga","Enrollar y envolver"],
  "rb04": ["Cocer arroz","Calentar cochinita pibil","Tortilla: arroz, chipotle, cochinita, frijoles","Anadir pico de gallo con pina, guacamole, lechuga, nata agria","Enrollar y envolver"],
  "rb05": ["Cocer arroz","Empanar pechuga y freir hasta dorada y crujiente","Tortilla: arroz, pollo empanado, mayo coco, cheddar","Anadir cebolla encurtida, esquites maiz risketos, lechuga","Enrollar y envolver"],
  "rb06": ["Cocer arroz","Calentar butter chicken (Tocawey)","Tortilla: arroz, butter chicken, mayo coco","Anadir pico de gallo, guacamole, totopos, lechuga","Enrollar y envolver"],
  "rb07": ["Cocer arroz","Calentar carrillada iberica deshilachada","Tortilla: arroz, carrillada, salsa lima","Anadir pico de gallo, cebolla encurtida, patatas paja, salsa verde","Enrollar y envolver"],
  "rb08": ["Cocer arroz","Calentar pollo braseado (Atlanta) - filetitos","Tortilla: arroz, pollo braseado, salsa BKK Hannibal","Anadir pico de gallo, frijoles, guacamole, nata agria, lechuga","Enrollar y envolver"],
  "rb09": ["Cocer arroz","Calentar pollo al pastor (Tocawey)","Tortilla: arroz, pollo pastor, salsa verde, frijoles","Anadir pico de gallo, guacamole, totopos, mix quesos, nata agria","Enrollar y envolver"],
  "rn01": ["Arroz bayo cocido como base (150g, mas que burrito)","Calentar pollo braseado","Montar bowl: arroz, pollo, salsa BKK, guacamole, pico","Anadir frijoles, lechuga, nata agria","Servir en envase bowl con tapa"],
  "rn02": ["Arroz base 150g","Saltear carne con chipotle","Bowl: arroz, carne, frijoles, cheddar, pico, guacamole","Lechuga, salsa verde. Envase bowl"],
  "rn03": ["Arroz base","Calentar cochinita","Bowl: arroz, cochinita, chipotle, frijoles, guacamole","Pico de gallo, pina, lechuga, nata agria. Envase bowl"],
  "rn04": ["Arroz base","Calentar pulled pork BBQ","Bowl: arroz, pulled pork, nata agria, pico, guacamole","Totopos, lechuga. Envase bowl"],
  "rn05": ["Arroz base","Calentar carrillada deshilachada","Bowl: arroz, carrillada, mayo lima, cebolla roja","Pico, patatas paja, salsa verde. Envase bowl"],
  "rn06": ["Arroz base 150g","Saltear Heura con especias","Bowl: arroz, Heura, salsa verde, frijoles","Pico, guacamole, lechuga. Envase bowl"],
  "rt01": ["Calentar carrillada deshilachada","Tortita taco 12cm en plancha","Montar: carrillada 60g, queso mix nachos, cebolla roja","Servir 3 uds por racion"],
  "rt02": ["Calentar cochinita pibil","Tortita en plancha","Montar: cochinita 60g, queso mix, guacamole","3 uds por racion"],
  "rt03": ["Calentar pulled pork BBQ","Tortita en plancha","Montar: pulled pork 60g, queso mix, guacamole","3 uds por racion"],
  "rt04": ["Calentar pollo pastor","Tortita en plancha","Montar: pollo pastor 60g, cebolla roja, chipotle","3 uds por racion"],
  "rt05": ["Calentar alitas pollo BBQ deshuesadas","Tortita en plancha","Montar: pollo buffalo 60g, chutney tomate, cebolla, queso mix","3 uds por racion"],
  "rq01": ["Calentar pulled pork BBQ","Tortilla burrito 30cm en plancha con 4 quesos mezcla","Anadir pulled pork 100g sobre queso","Doblar tortilla, grillar ambos lados hasta crujiente y queso fundido","Cortar diagonal"],
  "rq02": ["Calentar butter chicken","Tortilla en plancha con 4 quesos","Anadir butter chicken 100g","Grillar ambos lados. Cortar diagonal"],
  "re01": ["Distribuir totopos en envase entrante","Anadir pulled pork BBQ caliente","Salsa cheddar USA caliente por encima","Queso mix nachos gratinado","Pico de gallo, guacamole, nata agria por encima"],
  "re02": ["Totopos en envase","Carne picada sazonada caliente","Frijoles negros, salsa cheddar USA","Queso mix gratinado","Guacamole, nata agria, pico de gallo"],
  "re03": ["Freir patatas a 180C hasta doradas y crujientes","Montar en envase: patatas, salsa ranchera caliente","Bacon topping, queso mix nachos gratinado"],
  "re04": ["Calentar 5 alitas BBQ al horno","Montar en envase con chutney tomate","Totopos crujientes al lado, mayo lima para dip"]
};

/* ====== MENU ENGINEERING MATRIX ====== */
function MatrixView(props) {
  var chS = useState("sala");
  var isDel = chS[0] === "delivery";

  // Calculate data for each product
  var data = [];
  var totalSales = 0;
  var totalMargin = 0;
  for (var i = 0; i < props.products.length; i++) {
    var p = props.products[i];
    var cost = props.getPC(p);
    var pvp = isDel ? (p.prices ? p.prices["Uber Eats"] || 0 : 0) : (p.prices ? p.prices.Sala || 0 : 0);
    var margin = pvp > 0 ? pvp - cost : 0;
    var sales = p.weekSales || 0;
    totalSales += sales;
    totalMargin += margin * sales;
    data.push({ id: p.id, name: p.name, category: p.category, cost: cost, pvp: pvp, margin: margin, sales: sales, weekRevenue: pvp * sales, weekProfit: margin * sales });
  }

  // Calculate averages for quadrant thresholds
  var avgSales = data.length > 0 ? totalSales / data.length : 0;
  var validItems = data.filter(function(d) { return d.pvp > 0; });
  var avgMargin = 0;
  if (validItems.length > 0) {
    var mSum = 0;
    for (var j = 0; j < validItems.length; j++) mSum += validItems[j].margin;
    avgMargin = mSum / validItems.length;
  }

  // Classify into quadrants
  var stars = []; var plowhorses = []; var puzzles = []; var dogs = [];
  for (var k = 0; k < data.length; k++) {
    var d = data[k];
    if (d.pvp <= 0) continue;
    var highPop = d.sales >= avgSales;
    var highProfit = d.margin >= avgMargin;
    if (highPop && highProfit) { d.quad = "star"; stars.push(d); }
    else if (highPop && !highProfit) { d.quad = "plow"; plowhorses.push(d); }
    else if (!highPop && highProfit) { d.quad = "puzzle"; puzzles.push(d); }
    else { d.quad = "dog"; dogs.push(d); }
  }

  stars.sort(function(a, b) { return b.weekProfit - a.weekProfit; });
  plowhorses.sort(function(a, b) { return b.sales - a.sales; });
  puzzles.sort(function(a, b) { return b.margin - a.margin; });
  dogs.sort(function(a, b) { return b.sales - a.sales; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  function QuadCard(title, emoji, color, items, advice, subtitle) {
    return (
      <div style={{ ...crd, borderTop: "4px solid " + color }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>{emoji}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: color }}>{title}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{subtitle}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 22, fontWeight: 800, color: color }}>{items.length}</div>
        </div>
        <div style={{ fontSize: 12, color: "#888", padding: "8px 0 12px", borderBottom: "1px solid #f0f0f0", marginBottom: 8, lineHeight: 1.5 }}>{advice}</div>
        {items.map(function(p, idx) {
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 6px", borderBottom: "1px solid #f8f8f8" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{p.category}</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 55 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.sales}/sem</div>
                <div style={{ fontSize: 10, color: "#888" }}>ventas</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 55 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.margin > avgMargin ? "#047857" : "#D97706" }}>{fmt(p.margin)}</div>
                <div style={{ fontSize: 10, color: "#888" }}>margen</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 60 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: color }}>{fmt(p.weekProfit)}</div>
                <div style={{ fontSize: 10, color: "#888" }}>benef/sem</div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "#ccc", fontSize: 12 }}>Ningun producto en este cuadrante</div>}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Menu Engineering Matrix</div>
          <div style={{ fontSize: 13, color: "#888" }}>Popularidad x Rentabilidad - clasifica tus productos para tomar decisiones</div>
        </div>
        <ChannelToggle value={chS[0]} onChange={chS[1]} />
      </div>

      {/* Thresholds info */}
      <div style={{ ...crd, marginBottom: 20, padding: 16 }}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13 }}>
          <div>Umbral popularidad: <strong style={{ color: "#1E40AF" }}>{Math.round(avgSales)} ventas/sem</strong></div>
          <div>Umbral margen: <strong style={{ color: "#047857" }}>{fmt(avgMargin)}</strong></div>
          <div>Revenue semanal total: <strong>{fmt(data.reduce(function(s, d) { return s + d.weekRevenue; }, 0))}</strong></div>
          <div>Beneficio semanal MP: <strong style={{ color: "#047857" }}>{fmt(data.reduce(function(s, d) { return s + d.weekProfit; }, 0))}</strong></div>
        </div>
      </div>

      {/* Four quadrants */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {QuadCard("ESTRELLAS", "★", "#047857", stars, "Populares Y rentables. Proteger, destacar en carta, no tocar precio. Son tu motor de beneficio.", "Alta popularidad + Alto margen")}
        {QuadCard("CABALLOS DE BATALLA", "🐴", "#1E40AF", plowhorses, "Muy populares pero margen bajo. Subir precio ligeramente, reducir porcion, o buscar ingredientes mas baratos sin perder calidad.", "Alta popularidad + Bajo margen")}
        {QuadCard("PUZZLES", "🧩", "#7C3AED", puzzles, "Rentables pero se venden poco. Promocionar, mover a mejor posicion en carta, sugerir por camareros, destacar en plataformas.", "Baja popularidad + Alto margen")}
        {QuadCard("PERROS", "🐕", "#DC2626", dogs, "Ni venden ni son rentables. Candidatos a eliminar de carta o reformular completamente.", "Baja popularidad + Bajo margen")}
      </div>
    </div>
  );
}

/* ====== FICHAS TECNICAS ====== */
function FichasView(props) {
  var expanded = useState(null);
  var ss = useState("");
  var openCat = useState(null);
  var editingSteps = useState(null);
  var newStep = useState("");
  var fl = props.recipes.filter(function(r) { return r.type === "escandallo" && r.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0; });

  function getIngName(refId) {
    for (var i = 0; i < props.ingredients.length; i++) { if (props.ingredients[i].id === refId) return props.ingredients[i]; }
    return null;
  }
  function getSupName(supId) {
    for (var i = 0; i < props.suppliers.length; i++) { if (props.suppliers[i].id === supId) return props.suppliers[i].name; }
    return "-";
  }

  // Group by category
  var grouped = {};
  var catOrder = ["Burritos", "Bowls", "Tacos", "Quesadillas", "Nachos", "Extras"];
  var catEmojis = { "Burritos": "🌯", "Bowls": "🥗", "Tacos": "🌮", "Quesadillas": "🧀", "Nachos": "🍿", "Extras": "🍟", "Otros": "📋" };
  for (var gi = 0; gi < fl.length; gi++) {
    var gr = fl[gi];
    var gcat = "Otros";
    for (var gp = 0; gp < props.products.length; gp++) { if (props.products[gp].recipeId === gr.id) { gcat = props.products[gp].category; break; } }
    if (!grouped[gcat]) grouped[gcat] = [];
    grouped[gcat].push(gr);
  }
  var cats = [];
  for (var co = 0; co < catOrder.length; co++) { if (grouped[catOrder[co]]) cats.push(catOrder[co]); }
  for (var gk in grouped) { if (catOrder.indexOf(gk) < 0) cats.push(gk); }

  function saveStep(recipeId, steps) {
    var updated = Object.assign({}, props.prepSteps[0]);
    updated[recipeId] = steps;
    props.prepSteps[1](updated);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Fichas Tecnicas</div>
        <div style={{ fontSize: 13, color: "#888" }}>Guias de preparacion con desglose de ingredientes - editables</div>
      </div>
      <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar receta..." style={{ maxWidth: 320, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cats.map(function(cat) {
          var catItems = grouped[cat];
          var isCatOpen = openCat[0] === cat || ss[0].length > 0;
          return (
            <div key={cat}>
              {/* Category header */}
              <div onClick={function() { openCat[1](isCatOpen && !ss[0] ? null : cat); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fff", borderRadius: 12, border: "1px solid #eee", cursor: "pointer", marginBottom: isCatOpen ? 8 : 0 }}>
                <span style={{ fontSize: 22 }}>{catEmojis[cat] || "📋"}</span>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{cat}</div>
                <Pill t={catItems.length + " fichas"} c="#B45309" />
                <div style={{ fontSize: 12, color: isCatOpen ? "#B45309" : "#ccc", transform: isCatOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
              </div>

              {/* Fichas in category */}
              {isCatOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
                  {catItems.map(function(r) {
                    var isOpen = expanded[0] === r.id;
                    var cost = calcRC(r.id, props.recipes, props.ingredients, {});
                    var steps = props.prepSteps[0][r.id] || [];
                    var linkedProduct = null;
                    for (var pp = 0; pp < props.products.length; pp++) { if (props.products[pp].recipeId === r.id) { linkedProduct = props.products[pp]; break; } }
                    var packQty = linkedProduct ? (linkedProduct.packQty || 1) : 1;
                    var productCost = cost * packQty;
                    var sala = linkedProduct && linkedProduct.prices ? linkedProduct.prices.Sala || 0 : 0;
                    var fc = sala > 0 ? (productCost / sala) * 100 : 0;
                    var isEditingSteps = editingSteps[0] === r.id;

                    return (
                      <div key={r.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#B4530940" : "#eee"), overflow: "hidden" }}>
                        <div onClick={function() { expanded[1](isOpen ? null : r.id); }} style={{ display: "flex", alignItems: "center", padding: "14px 18px", cursor: "pointer", gap: 12 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, background: isOpen ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isOpen ? "#B45309" : "#ccc", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name.replace("Esc ", "")}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{(r.items || []).length} ingr. | {steps.length} pasos | {r.notes}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "#B45309" }}>{fmt(productCost)}</div>
                            {sala > 0 && <div style={{ fontSize: 11, color: fc > 35 ? "#DC2626" : "#047857" }}>FC {fPct(fc)}</div>}
                          </div>
                        </div>

                        {isOpen && (
                          <div style={{ borderTop: "1px solid #f0f0f0" }}>
                            {linkedProduct && (
                              <div style={{ display: "flex", gap: 14, padding: "12px 18px", background: "#fafaf8", flexWrap: "wrap", fontSize: 12, color: "#888" }}>
                                <span>Producto: <strong style={{ color: "#333" }}>{linkedProduct.name}</strong></span>
                                <span>PVP Sala: <strong>{fmt(sala)}</strong></span>
                                <span>PVP Delivery: <strong>{fmt(linkedProduct.prices ? linkedProduct.prices["Uber Eats"] || 0 : 0)}</strong></span>
                                <span>Coste: <strong style={{ color: "#B45309" }}>{fmt(productCost)}</strong>{packQty > 1 ? " (x" + packQty + ")" : ""}</span>
                                <span>FC: <strong style={{ color: fc > 35 ? "#DC2626" : "#047857" }}>{fPct(fc)}</strong></span>
                              </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: steps.length > 0 || isEditingSteps ? "1fr 1fr" : "1fr", gap: 0 }}>
                              {/* Ingredients */}
                              <div style={{ padding: "14px 18px", borderRight: "1px solid #f0f0f0" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "#B45309" }}>INGREDIENTES</div>
                                {(function() {
                                  var lines = [];
                                  for (var li = 0; li < (r.items || []).length; li++) {
                                    var it = r.items[li];
                                    var ing = getIngName(it.refId);
                                    if (!ing) continue;
                                    var lc = (ing.costPerUnit || 0) * (it.qty || 0);
                                    var qd = ing.unit === "ud" ? (it.qty || 0) + " ud" : Math.round((it.qty || 0) * 1000) + "g";
                                    lines.push({ name: ing.name, qty: qd, lc: lc, pct: cost > 0 ? (lc / cost) * 100 : 0, sup: getSupName(ing.supplierId) });
                                  }
                                  lines.sort(function(a, b) { return b.lc - a.lc; });
                                  return lines.map(function(l, idx) {
                                    return (
                                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 4px", borderBottom: "1px solid #f8f8f8", fontSize: 12 }}>
                                        <div style={{ flex: 1 }}><span style={{ fontWeight: idx < 2 ? 600 : 400 }}>{l.name}</span><br /><span style={{ fontSize: 10, color: "#bbb" }}>{l.sup}</span></div>
                                        <span style={{ color: "#666", minWidth: 40, textAlign: "right" }}>{l.qty}</span>
                                        <span style={{ fontWeight: 600, minWidth: 45, textAlign: "right" }}>{fmt(l.lc)}</span>
                                        <div style={{ width: 28, height: 4, borderRadius: 2, background: "#f0f0f0", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: l.pct > 30 ? "#DC2626" : l.pct > 15 ? "#B45309" : "#047857", width: Math.min(l.pct, 100) + "%" }} /></div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              {/* Preparation steps - editable */}
                              <div style={{ padding: "14px 18px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF" }}>PREPARACION</div>
                                  <button onClick={function() { editingSteps[1](isEditingSteps ? null : r.id); newStep[1](""); }} style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid " + (isEditingSteps ? "#DC2626" : "#1E40AF"), background: isEditingSteps ? "#FEF2F2" : "#EFF6FF", color: isEditingSteps ? "#DC2626" : "#1E40AF", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{isEditingSteps ? "Cerrar" : "Editar"}</button>
                                </div>
                                {steps.map(function(step, idx) {
                                  return (
                                    <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                                      <div style={{ width: 22, height: 22, borderRadius: 11, background: "#1E40AF10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1E40AF", flexShrink: 0 }}>{idx + 1}</div>
                                      <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5, flex: 1, paddingTop: 1 }}>{step}</div>
                                      {isEditingSteps && (
                                        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                                          <button onClick={function() { if (idx === 0) return; var n = steps.slice(); var t = n[idx]; n[idx] = n[idx-1]; n[idx-1] = t; saveStep(r.id, n); }} style={{ background: "none", border: "none", color: idx === 0 ? "#eee" : "#888", cursor: "pointer", fontSize: 12 }}>^</button>
                                          <button onClick={function() { saveStep(r.id, steps.filter(function(s,si) { return si !== idx; })); }} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: 12 }}>x</button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {isEditingSteps && (
                                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                    <input value={newStep[0]} onChange={function(e) { newStep[1](e.target.value); }} placeholder="Nuevo paso..." style={{ flex: 1, padding: "6px 10px", border: "1px solid #e5e5e5", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }} onKeyDown={function(e) { if (e.key === "Enter" && newStep[0].trim()) { saveStep(r.id, steps.concat([newStep[0].trim()])); newStep[1](""); } }} />
                                    <button onClick={function() { if (!newStep[0].trim()) return; saveStep(r.id, steps.concat([newStep[0].trim()])); newStep[1](""); }} style={{ padding: "6px 12px", background: "#1E40AF", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>+</button>
                                  </div>
                                )}
                                {steps.length === 0 && !isEditingSteps && <div style={{ padding: 12, textAlign: "center", color: "#ccc", fontSize: 12 }}>Sin pasos - pulsa Editar para anadir</div>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====== FICHAS EMPLEADO (sin costes ni precios) ====== */
function FichasEmpView(props) {
  var expanded = useState(null);
  var ss = useState("");
  var openCat = useState(null);
  var fl = props.recipes.filter(function(r) { return r.type === "escandallo" && r.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0; });

  function getIngName(refId) {
    for (var i = 0; i < props.ingredients.length; i++) { if (props.ingredients[i].id === refId) return props.ingredients[i]; }
    return null;
  }

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg, #1E40AF 0%, #1E3A5F 100%)", borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0 }}>{props.user ? props.user.name[0].toUpperCase() : "?"}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Hola {props.user ? props.user.name : ""}!</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{props.user ? props.user.local : ""} | {props.recipes.length} recetas disponibles</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{props.stockAlerts ? props.stockAlerts[0].length : 0}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>Alertas stock</div>
          </div>
          <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{props.incidents ? props.incidents[0].filter(function(x) { return x.status === "abierta"; }).length : 0}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>Incidencias</div>
          </div>
          <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{props.opsData ? props.opsData[0].alertasProducto.length : 0}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>Alertas prod.</div>
          </div>
        </div>
      </div>

      {/* Tasks from encargado */}
      {(function() {
        var myName = props.user ? props.user.name : "";
        var myTasks = props.weekTasks ? props.weekTasks[0].filter(function(t) { return t.person === myName && !t.done; }) : [];
        var allTasks = props.weekTasks ? props.weekTasks[0].filter(function(t) { return !t.person && !t.done; }) : [];
        var combined = myTasks.concat(allTasks);
        if (combined.length === 0) return null;
        return (
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eee", borderLeft: "4px solid #D97706", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#D97706", marginBottom: 10 }}>TAREAS ASIGNADAS ({combined.length})</div>
            {combined.map(function(t) {
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: "#D97706", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.task}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{t.day}{t.person ? " - Para: " + t.person : " - General"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Alertas producto + Comunicados */}
      {(function() {
        var od = props.opsData ? props.opsData[0] : null;
        if (!od) return null;
        var uName = props.user ? props.user.name : "";
        var unread = od.comunicados.filter(function(c) { return (c.readBy || []).indexOf(uName) < 0; });
        var lvlC = { sanitaria: "#DC2626", critico: "#D97706", vigilar: "#1E40AF", atencion: "#7C3AED" };
        var hasContent = od.alertasProducto.length > 0 || unread.length > 0;
        if (!hasContent) return null;
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 20 }}>
            {unread.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eee", borderLeft: "4px solid #D97706" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#D97706", marginBottom: 10 }}>COMUNICADOS NUEVOS ({unread.length})</div>
                {unread.map(function(c) {
                  return (
                    <div key={c.id} style={{ padding: "8px 12px", marginBottom: 6, borderRadius: 8, background: "#FEF3C7" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{c.content.length > 100 ? c.content.substring(0, 100) + "..." : c.content}</div>
                    </div>
                  );
                })}
                <div style={{ fontSize: 11, color: "#B45309", marginTop: 4 }}>Ve a Operaciones para leer completos y marcar como leido</div>
              </div>
            )}
            {od.alertasProducto.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eee", borderLeft: "4px solid #DC2626" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", marginBottom: 10 }}>PRODUCTOS A VIGILAR HOY ({od.alertasProducto.length})</div>
                {od.alertasProducto.slice(0, 4).map(function(a) {
                  var lc = lvlC[a.level] || "#888";
                  return (
                    <div key={a.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: lc, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: lc }}>{a.product}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{a.actions}</div>
                      </div>
                    </div>
                  );
                })}
                {od.alertasProducto.length > 4 && <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>+{od.alertasProducto.length - 4} mas en Operaciones</div>}
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Recetas</div>
        <div style={{ fontSize: 13, color: "#888" }}>Guias de preparacion paso a paso</div>
      </div>
      <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar receta..." style={{ maxWidth: 320, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />

      {(function() {
        var grouped = {};
        var catOrder = ["Burritos", "Bowls", "Tacos", "Quesadillas", "Nachos", "Extras"];
        var catEmojis = { "Burritos": "🌯", "Bowls": "🥗", "Tacos": "🌮", "Quesadillas": "🧀", "Nachos": "🍿", "Extras": "🍟", "Otros": "📋" };
        for (var gi = 0; gi < fl.length; gi++) {
          var gr = fl[gi]; var gcat = "Otros";
          for (var gp = 0; gp < props.products.length; gp++) { if (props.products[gp].recipeId === gr.id) { gcat = props.products[gp].category; break; } }
          if (!grouped[gcat]) grouped[gcat] = [];
          grouped[gcat].push(gr);
        }
        var cats = [];
        for (var co = 0; co < catOrder.length; co++) { if (grouped[catOrder[co]]) cats.push(catOrder[co]); }
        for (var gk in grouped) { if (catOrder.indexOf(gk) < 0) cats.push(gk); }

        return cats.map(function(cat) {
          var catItems = grouped[cat];
          var isCatOpen = openCat[0] === cat || ss[0].length > 0;
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div onClick={function() { openCat[1](isCatOpen && !ss[0] ? null : cat); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fff", borderRadius: 12, border: "1px solid #eee", cursor: "pointer", marginBottom: isCatOpen ? 8 : 0 }}>
                <span style={{ fontSize: 22 }}>{catEmojis[cat] || "📋"}</span>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{cat}</div>
                <Pill t={catItems.length + ""} c="#1E40AF" />
                <div style={{ fontSize: 12, color: isCatOpen ? "#1E40AF" : "#ccc", transform: isCatOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
              </div>
              {isCatOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
                  {catItems.map(function(r) {
                    var isOpen = expanded[0] === r.id;
                    var steps = props.prepSteps[0][r.id] || [];
                    var prodName = "";
                    for (var pp = 0; pp < props.products.length; pp++) { if (props.products[pp].recipeId === r.id) { prodName = props.products[pp].name; break; } }
                    var ingList = [];
                    for (var j = 0; j < (r.items || []).length; j++) {
                      var it = r.items[j]; var ing = getIngName(it.refId);
                      if (!ing) continue;
                      ingList.push({ name: ing.name, qty: ing.unit === "ud" ? (it.qty || 0) + " ud" : Math.round((it.qty || 0) * 1000) + "g" });
                    }
                    return (
                      <div key={r.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#1E40AF40" : "#eee"), overflow: "hidden" }}>
                        <div onClick={function() { expanded[1](isOpen ? null : r.id); }} style={{ display: "flex", alignItems: "center", padding: "14px 18px", cursor: "pointer", gap: 12 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, background: isOpen ? "#1E40AF15" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isOpen ? "#1E40AF" : "#ccc", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{prodName || r.name.replace("Esc ", "")}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{ingList.length} ingredientes | {steps.length} pasos</div>
                          </div>
                          <Pill t={steps.length + " pasos"} c="#1E40AF" />
                        </div>
                        {isOpen && (
                          <div style={{ borderTop: "1px solid #f0f0f0" }}>
                            <div style={{ display: "grid", gridTemplateColumns: steps.length > 0 ? "1fr 1fr" : "1fr", gap: 0 }}>
                              <div style={{ padding: "14px 18px", borderRight: steps.length > 0 ? "1px solid #f0f0f0" : "none" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: "#B45309" }}>INGREDIENTES Y CANTIDADES</div>
                                {ingList.map(function(item, idx) {
                                  return (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 4px", borderBottom: "1px solid #f8f8f8" }}>
                                      <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: "#B45309", background: "#B4530908", padding: "2px 8px", borderRadius: 6 }}>{item.qty}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              {steps.length > 0 && (
                                <div style={{ padding: "14px 18px" }}>
                                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: "#1E40AF" }}>PASO A PASO</div>
                                  {steps.map(function(step, idx) {
                                    return (
                                      <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                        <div style={{ width: 24, height: 24, borderRadius: 12, background: "#1E40AF10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1E40AF", flexShrink: 0 }}>{idx + 1}</div>
                                        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, paddingTop: 2 }}>{step}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        });
      })()}
    </div>
  );
}

/* ====== STOCK RAPIDO (sin precios) ====== */
function StockView(props) {
  var alerts = props.stockAlerts;
  var ss = useState("");

  var ingList = props.ingredients.filter(function(i) { return i.name.toLowerCase().indexOf(ss[0].toLowerCase()) >= 0; });
  // Group by category
  var cats = {};
  for (var i = 0; i < ingList.length; i++) {
    var ing = ingList[i];
    if (!cats[ing.category]) cats[ing.category] = [];
    cats[ing.category].push(ing);
  }
  var catKeys = [];
  for (var k in cats) catKeys.push(k);
  catKeys.sort();

  function isAlerted(ingId) {
    for (var i = 0; i < alerts[0].length; i++) { if (alerts[0][i].id === ingId) return alerts[0][i]; }
    return null;
  }

  function toggleAlert(ing, level) {
    var existing = isAlerted(ing.id);
    var next = alerts[0].filter(function(a) { return a.id !== ing.id; });
    if (!existing || existing.level !== level) {
      next.push({ id: ing.id, name: ing.name, category: ing.category, level: level, time: new Date().toLocaleTimeString(), local: props.user ? (props.user.local || "Todos") : "", user: props.user ? props.user.name : "" });
    }
    alerts[1](next);
  }

  var activeAlerts = alerts[0].slice().sort(function(a, b) { var order = { out: 0, low: 1 }; return (order[a.level] || 2) - (order[b.level] || 2); });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Stock y Calidad</div>
        <div style={{ fontSize: 13, color: "#888" }}>Marca ingredientes bajos, agotados, en mal estado o proximos a caducar</div>
      </div>

      {/* Active alerts summary */}
      {activeAlerts.length > 0 && (
        <div style={{ ...crd, marginBottom: 20, borderLeft: "4px solid #DC2626" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", marginBottom: 10 }}>ALERTAS ACTIVAS ({activeAlerts.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {activeAlerts.map(function(a) {
              var levelInfo = { out: { emoji: "🔴", label: "AGOTADO", bg: "#FEE2E2", border: "#FECACA", color: "#991B1B" }, low: { emoji: "🟡", label: "BAJO", bg: "#FEF3C7", border: "#FDE68A", color: "#92400E" }, bad: { emoji: "🟣", label: "MALO", bg: "#F3E8FF", border: "#DDD6FE", color: "#6D28D9" }, expires: { emoji: "🩷", label: "CADUCA", bg: "#FCE7F3", border: "#FBCFE8", color: "#9D174D" } };
              var li = levelInfo[a.level] || levelInfo.low;
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: li.bg, border: "1px solid " + li.border }}>
                  <span style={{ fontSize: 14 }}>{li.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: li.color }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: "#888" }}>{li.label} - {a.time}{a.local ? " - " + a.local : ""}</div>
                  </div>
                  <button onClick={function() { toggleAlert(a, a.level); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 16, marginLeft: 4 }}>x</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <input value={ss[0]} onChange={function(e) { ss[1](e.target.value); }} placeholder="Buscar ingrediente..." style={{ maxWidth: 320, padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {catKeys.map(function(cat) {
          return (
            <div key={cat} style={crd}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#555" }}>{cat}</div>
              {cats[cat].map(function(ing) {
                var alert = isAlerted(ing.id);
                return (
                  <div key={ing.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", borderBottom: "1px solid #f8f8f8" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: alert ? 700 : 500, color: alert && alert.level === "out" ? "#DC2626" : alert ? "#D97706" : "#333" }}>{ing.name}</span>
                    </div>
                    <button onClick={function() { toggleAlert(ing, "low"); }} style={{ padding: "4px 8px", borderRadius: 6, border: alert && alert.level === "low" ? "2px solid #D97706" : "1px solid #e5e5e5", background: alert && alert.level === "low" ? "#FEF3C7" : "#fff", color: "#D97706", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>BAJO</button>
                    <button onClick={function() { toggleAlert(ing, "out"); }} style={{ padding: "4px 8px", borderRadius: 6, border: alert && alert.level === "out" ? "2px solid #DC2626" : "1px solid #e5e5e5", background: alert && alert.level === "out" ? "#FEE2E2" : "#fff", color: "#DC2626", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>AGOTADO</button>
                    <button onClick={function() { toggleAlert(ing, "bad"); }} style={{ padding: "4px 8px", borderRadius: 6, border: alert && alert.level === "bad" ? "2px solid #7C3AED" : "1px solid #e5e5e5", background: alert && alert.level === "bad" ? "#F3E8FF" : "#fff", color: "#7C3AED", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>MALO</button>
                    <button onClick={function() { toggleAlert(ing, "expires"); }} style={{ padding: "4px 8px", borderRadius: 6, border: alert && alert.level === "expires" ? "2px solid #BE185D" : "1px solid #e5e5e5", background: alert && alert.level === "expires" ? "#FCE7F3" : "#fff", color: "#BE185D", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>CADUCA</button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ====== INCIDENCIAS ====== */
function IncidenciasView(props) {
  var incidents = props.incidents;
  var formCat = useState("stock");
  var formDesc = useState("");
  var formUrgent = useState(false);
  var incLocalF = useState("Todos");

  function addIncident() {
    if (!formDesc[0].trim()) return;
    var inc = {
      id: Math.random().toString(36).slice(2),
      category: formCat[0],
      description: formDesc[0].trim(),
      urgent: formUrgent[0],
      user: props.user ? props.user.name : "Anonimo",
      local: props.user ? (props.user.local || "Todos") : "",
      time: new Date().toLocaleString(),
      status: "abierta"
    };
    incidents[1]([inc].concat(incidents[0]));
    formDesc[1]("");
    formUrgent[1](false);
  }

  function resolveIncident(id) {
    var next = incidents[0].map(function(inc) {
      if (inc.id === id) return { ...inc, status: inc.status === "abierta" ? "resuelta" : "abierta" };
      return inc;
    });
    incidents[1](next);
  }

  var filteredInc = incLocalF[0] === "Todos" ? incidents[0] : incidents[0].filter(function(x) { return x.local === incLocalF[0]; });

  var categories = [
    { k: "stock", l: "Stock / Producto", emoji: "📦" },
    { k: "equipo", l: "Equipo / Maquinaria", emoji: "🔧" },
    { k: "limpieza", l: "Limpieza / Higiene", emoji: "🧹" },
    { k: "pedido", l: "Pedido / Cliente", emoji: "📋" },
    { k: "personal", l: "Personal", emoji: "👤" },
    { k: "otro", l: "Otro", emoji: "📌" },
  ];

  var openCount = 0;
  var resolvedCount = 0;
  for (var c = 0; c < incidents[0].length; c++) {
    if (incidents[0][c].status === "abierta") openCount++;
    else resolvedCount++;
  }

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Incidencias</div>
        <div style={{ fontSize: 13, color: "#888" }}>Reporta problemas para que el encargado los vea</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* New incident form */}
        <div style={crd}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Nueva incidencia</div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>TIPO</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categories.map(function(cat) {
                var active = formCat[0] === cat.k;
                return (
                  <button key={cat.k} onClick={function() { formCat[1](cat.k); }} style={{ padding: "8px 14px", borderRadius: 8, border: active ? "2px solid #B45309" : "1px solid #e5e5e5", background: active ? "#B4530908" : "#fff", color: active ? "#B45309" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {cat.emoji} {cat.l}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>DESCRIPCION</div>
            <textarea value={formDesc[0]} onChange={function(e) { formDesc[1](e.target.value); }} placeholder="Describe el problema..." rows="3" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
              <input type="checkbox" checked={formUrgent[0]} onChange={function(e) { formUrgent[1](e.target.checked); }} />
              <span style={{ fontWeight: 600, color: formUrgent[0] ? "#DC2626" : "#888" }}>URGENTE</span>
            </label>
          </div>

          <button onClick={addIncident} disabled={!formDesc[0].trim()} style={{ width: "100%", padding: 12, background: "#B45309", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: formDesc[0].trim() ? 1 : 0.4 }}>Enviar incidencia</button>
        </div>

        {/* Incidents list */}
        <div style={crd}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Historial</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Pill t={openCount + " abiertas"} c={openCount > 0 ? "#DC2626" : "#047857"} />
              <Pill t={resolvedCount + " resueltas"} c="#047857" />
            </div>
          </div>

          {/* Local filter for socio */}
          {props.user && (props.user.role === "socio" || props.user.role === "encargado") && (
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              {["Todos"].concat(LOCALS).map(function(loc) {
                var count = loc === "Todos" ? incidents[0].length : incidents[0].filter(function(x) { return x.local === loc; }).length;
                return (
                  <button key={loc} onClick={function() { incLocalF[1](loc); }} style={{ padding: "5px 12px", borderRadius: 6, border: incLocalF[0] === loc ? "2px solid #B45309" : "1px solid #e5e5e5", background: incLocalF[0] === loc ? "#B4530908" : "#fff", color: incLocalF[0] === loc ? "#B45309" : "#888", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {loc} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {filteredInc.length === 0 && (
            <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>Sin incidencias{incLocalF[0] !== "Todos" ? " en " + incLocalF[0] : ""}</div>
          )}

          {filteredInc.map(function(inc) {
            var cat = null;
            for (var ci = 0; ci < categories.length; ci++) { if (categories[ci].k === inc.category) { cat = categories[ci]; break; } }
            var isOpen = inc.status === "abierta";
            return (
              <div key={inc.id} style={{ padding: "14px 10px", borderBottom: "1px solid #f5f5f5", opacity: isOpen ? 1 : 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{cat ? cat.emoji : "📌"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{inc.description}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{cat ? cat.l : inc.category} | {inc.user} | <strong>{inc.local}</strong> | {inc.time}</div>
                  </div>
                  {inc.urgent && isOpen && <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: 4 }}>URGENTE</span>}
                  <button onClick={function() { resolveIncident(inc.id); }} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid " + (isOpen ? "#047857" : "#e5e5e5"), background: isOpen ? "#F0FDF4" : "#f9f9f9", color: isOpen ? "#047857" : "#aaa", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {isOpen ? "Resolver" : "Reabrir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ====== EQUIPO (Team Management) ====== */
function EquipoView(props) {
  var team = props.team;
  var formName = useState("");
  var formRole = useState("empleado");
  var formLocal = useState("San Luis");

  function addMember() {
    if (!formName[0].trim()) return;
    var member = {
      id: Math.random().toString(36).slice(2),
      name: formName[0].trim(),
      role: formRole[0],
      local: formRole[0] === "socio" ? null : formLocal[0],
      active: true
    };
    team[1](team[0].concat([member]));
    formName[1]("");
  }

  function toggleActive(id) {
    team[1](team[0].map(function(m) {
      return m.id === id ? Object.assign({}, m, { active: !m.active }) : m;
    }));
  }

  function removeMember(id) {
    team[1](team[0].filter(function(m) { return m.id !== id; }));
  }

  var socios = team[0].filter(function(m) { return m.role === "socio"; });
  var encargados = team[0].filter(function(m) { return m.role === "encargado"; });
  var empleados = team[0].filter(function(m) { return m.role === "empleado"; });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var roleColors = { socio: "#B45309", encargado: "#047857", empleado: "#1E40AF" };

  function MemberRow(m) {
    var rc = roleColors[m.role] || "#888";
    return (
      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderBottom: "1px solid #f5f5f5", opacity: m.active ? 1 : 0.4 }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: rc + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: rc, flexShrink: 0 }}>{m.name[0].toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
          <div style={{ fontSize: 11, color: "#aaa" }}>{m.role}{m.local ? " - " + m.local : " - Todos los locales"}</div>
        </div>
        <Pill t={m.role} c={rc} />
        <button onClick={function() { toggleActive(m.id); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", background: m.active ? "#FEF2F2" : "#F0FDF4", color: m.active ? "#DC2626" : "#047857", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{m.active ? "Desactivar" : "Activar"}</button>
        {m.role !== "socio" && <button onClick={function() { removeMember(m.id); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", background: "#fff", color: "#ccc", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Eliminar</button>}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Equipo</div>
        <div style={{ fontSize: 13, color: "#888" }}>Gestiona socios, encargados y empleados</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
        {/* Add member form */}
        <div style={crd}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Nuevo miembro</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>NOMBRE</div>
            <input value={formName[0]} onChange={function(e) { formName[1](e.target.value); }} placeholder="Nombre" style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>ROL</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["empleado", "encargado", "socio"].map(function(r) {
                var active = formRole[0] === r;
                var rc = roleColors[r];
                return <button key={r} onClick={function() { formRole[1](r); }} style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", border: active ? "2px solid " + rc : "1px solid #e5e5e5", background: active ? rc + "08" : "#fff", color: active ? rc : "#bbb", fontFamily: "inherit" }}>{r}</button>;
              })}
            </div>
          </div>
          {formRole[0] !== "socio" && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>LOCAL</div>
              <select value={formLocal[0]} onChange={function(e) { formLocal[1](e.target.value); }} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e5e5", borderRadius: 10, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}>
                {LOCALS.map(function(l) { return <option key={l} value={l}>{l}</option>; })}
              </select>
            </div>
          )}
          <button onClick={addMember} disabled={!formName[0].trim()} style={{ width: "100%", padding: 12, background: "#B45309", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: formName[0].trim() ? 1 : 0.4 }}>Agregar miembro</button>
        </div>

        {/* Team list */}
        <div style={crd}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Equipo actual</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Pill t={socios.length + " socios"} c="#B45309" />
              <Pill t={encargados.length + " encarg."} c="#047857" />
              <Pill t={empleados.length + " empl."} c="#1E40AF" />
            </div>
          </div>

          {socios.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#B45309", marginBottom: 4, marginTop: 8 }}>SOCIOS</div>}
          {socios.map(MemberRow)}
          {encargados.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#047857", marginBottom: 4, marginTop: 12 }}>ENCARGADOS</div>}
          {encargados.map(MemberRow)}
          {empleados.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 4, marginTop: 12 }}>EMPLEADOS</div>}
          {empleados.map(MemberRow)}

          {team[0].length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#ccc", fontSize: 13 }}>Sin miembros en el equipo</div>}
        </div>

        {/* Stats by local */}
        <div style={crd}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Por local</div>
          {LOCALS.map(function(loc) {
            var locMembers = team[0].filter(function(m) { return m.local === loc && m.active; });
            var locEnc = locMembers.filter(function(m) { return m.role === "encargado"; });
            var locEmp = locMembers.filter(function(m) { return m.role === "empleado"; });
            return (
              <div key={loc} style={{ padding: "14px 10px", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{loc}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
                  <span>Encargados: <strong style={{ color: locEnc.length > 0 ? "#047857" : "#DC2626" }}>{locEnc.length}</strong></span>
                  <span>Empleados: <strong>{locEmp.length}</strong></span>
                  <span>Total: <strong>{locMembers.length}</strong></span>
                </div>
                {locEnc.length === 0 && <div style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>Sin encargado asignado</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ====== GESTION (Admin - Socio only) ====== */
function GestionView(props) {
  var tab = useState("productos");
  var editId = useState(null);
  var editForm = useState({});
  var addMode = useState(false);
  var newForm = useState({});
  var teamMembers = useState([
    { id: "t1", name: "Carlos", role: "encargado", local: "San Luis", phone: "654 123 456", active: true },
    { id: "t2", name: "Maria", role: "encargado", local: "Sevilla Este", phone: "654 789 012", active: true },
    { id: "t3", name: "Pedro", role: "empleado", local: "San Luis", phone: "654 345 678", active: true },
    { id: "t4", name: "Ana", role: "empleado", local: "Los Remedios", phone: "654 901 234", active: true },
    { id: "t5", name: "Luis", role: "empleado", local: "Sevilla Este", phone: "654 567 890", active: true },
  ]);
  var filterIng = useState("");
  var confirmReset = useState(false);
  var editingPasos = useState(null);
  var newStepText = useState("");

  var tabs = [
    { k: "productos", l: "Productos y Precios" },
    { k: "ingredientes", l: "Ingredientes y Costes" },
    { k: "proveedores", l: "Proveedores" },
    { k: "ventas", l: "Ventas Semanales" },
    { k: "equipo", l: "Equipo" },
    { k: "pasos", l: "Pasos Preparacion" },
    { k: "historial", l: "Historial Precios" },
    { k: "reset", l: "Reset" },
  ];

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };
  var btn = { padding: "8px 18px", background: "#B45309", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

  // ── PRODUCTOS TAB ──
  function renderProductos() {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Edita precios por canal. Click en un producto para modificarlo.</div>
          <button onClick={function() { addMode[1](!addMode[0]); newForm[1]({ name: "", category: "Burritos", sala: "", ue: "", glovo: "" }); }} style={btn}>{addMode[0] ? "Cancelar" : "+ Nuevo producto"}</button>
        </div>

        {addMode[0] && (
          <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #047857" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Nuevo producto</div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Nombre</div>
                <input value={newForm[0].name || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { name: e.target.value })); }} style={inp} placeholder="Ej: Burro Nuevo" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Categoria</div>
                <select value={newForm[0].category || "Burritos"} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { category: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                  {PROD_CATS.map(function(c) { return <option key={c} value={c}>{c}</option>; })}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>PVP Sala</div>
                <input type="number" step="0.05" value={newForm[0].sala || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { sala: e.target.value })); }} style={{ ...inp, textAlign: "right" }} placeholder="9.90" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>PVP UE</div>
                <input type="number" step="0.05" value={newForm[0].ue || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { ue: e.target.value })); }} style={{ ...inp, textAlign: "right" }} placeholder="10.90" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>PVP Glovo</div>
                <input type="number" step="0.05" value={newForm[0].glovo || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { glovo: e.target.value })); }} style={{ ...inp, textAlign: "right" }} placeholder="10.90" />
              </div>
            </div>
            <button onClick={function() {
              if (!newForm[0].name.trim()) return;
              var np = { id: "p" + Date.now(), name: newForm[0].name.trim(), recipeId: "", category: newForm[0].category, prices: { Sala: parseFloat(newForm[0].sala) || 0, "Uber Eats": parseFloat(newForm[0].ue) || 0, Glovo: parseFloat(newForm[0].glovo) || 0, "Canal Propio": 0 }, active: true, weekSales: 0 };
              props.setProd(props.products.concat([np]));
              addMode[1](false);
            }} style={btn}>Crear producto</button>
          </div>
        )}
        <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>PRODUCTO</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>CAT.</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>SALA</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>UBER EATS</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>GLOVO</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}></th>
            </tr></thead>
            <tbody>
              {props.products.map(function(p) {
                var isEditing = editId[0] === p.id;
                if (isEditing) {
                  var ef = editForm[0];
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0", background: "#FFFBEB" }}>
                      <td style={{ padding: "8px 14px", fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: "8px 14px" }}>{p.category}</td>
                      <td style={{ padding: "8px 14px" }}><input type="number" step="0.05" value={ef.sala || ""} onChange={function(e) { editForm[1](Object.assign({}, ef, { sala: e.target.value })); }} style={{ ...inp, width: 80, textAlign: "right", padding: "6px 8px" }} /></td>
                      <td style={{ padding: "8px 14px" }}><input type="number" step="0.05" value={ef.ue || ""} onChange={function(e) { editForm[1](Object.assign({}, ef, { ue: e.target.value })); }} style={{ ...inp, width: 80, textAlign: "right", padding: "6px 8px" }} /></td>
                      <td style={{ padding: "8px 14px" }}><input type="number" step="0.05" value={ef.glovo || ""} onChange={function(e) { editForm[1](Object.assign({}, ef, { glovo: e.target.value })); }} style={{ ...inp, width: 80, textAlign: "right", padding: "6px 8px" }} /></td>
                      <td style={{ padding: "8px 14px", textAlign: "center" }}>
                        <button onClick={function() {
                          var updated = props.products.map(function(x) {
                            if (x.id !== p.id) return x;
                            return Object.assign({}, x, { prices: { Sala: parseFloat(ef.sala) || 0, "Uber Eats": parseFloat(ef.ue) || 0, Glovo: parseFloat(ef.glovo) || 0, "Canal Propio": x.prices["Canal Propio"] || 0 } });
                          });
                          props.setProd(updated);
                          editId[1](null);
                        }} style={{ ...btn, padding: "4px 12px", fontSize: 11 }}>OK</button>
                        <button onClick={function() { editId[1](null); }} style={{ ...btn, padding: "4px 12px", fontSize: 11, background: "#e5e5e5", color: "#888", marginLeft: 4 }}>X</button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }} onClick={function() { editId[1](p.id); editForm[1]({ sala: p.prices.Sala, ue: p.prices["Uber Eats"], glovo: p.prices.Glovo }); }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "10px 14px" }}><Pill t={p.category} /></td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{fmt(p.prices.Sala)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{fmt(p.prices["Uber Eats"])}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>{fmt(p.prices.Glovo)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#ccc", fontSize: 11 }}>editar</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── INGREDIENTES TAB ──
  function renderIngredientes() {
    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Actualiza precios de proveedor. Click para editar.</div>
        <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>INGREDIENTE</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>CATEGORIA</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>COSTE/UD</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}>UD</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}></th>
            </tr></thead>
            <tbody>
              {props.ingredients.map(function(i) {
                var isEditing = editId[0] === i.id;
                if (isEditing) {
                  var ef = editForm[0];
                  return (
                    <tr key={i.id} style={{ borderBottom: "1px solid #f0f0f0", background: "#FFFBEB" }}>
                      <td style={{ padding: "8px 14px", fontWeight: 600 }}>{i.name}</td>
                      <td style={{ padding: "8px 14px" }}>{i.category}</td>
                      <td style={{ padding: "8px 14px" }}><input type="number" step="0.01" value={ef.cost || ""} onChange={function(e) { editForm[1]({ cost: e.target.value }); }} style={{ ...inp, width: 90, textAlign: "right", padding: "6px 8px" }} /></td>
                      <td style={{ padding: "8px 14px", textAlign: "center" }}>{i.unit}</td>
                      <td style={{ padding: "8px 14px", textAlign: "center" }}>
                        <button onClick={function() {
                          var newCost = parseFloat(ef.cost) || 0;
                          var oldCost = i.costPerUnit;
                          var updated = props.ingredients.map(function(x) {
                            if (x.id !== i.id) return x;
                            return Object.assign({}, x, { costPerUnit: newCost });
                          });
                          props.setIng(updated);
                          if (newCost !== oldCost) {
                            var entry = { id: Math.random().toString(36).slice(2), ingredientId: i.id, ingredientName: i.name, oldPrice: oldCost, newPrice: newCost, unit: i.unit, date: new Date().toLocaleString(), change: ((newCost - oldCost) / oldCost * 100) };
                            props.priceHistory[1]([entry].concat(props.priceHistory[0]));
                          }
                          editId[1](null);
                        }} style={{ ...btn, padding: "4px 12px", fontSize: 11 }}>OK</button>
                        <button onClick={function() { editId[1](null); }} style={{ ...btn, padding: "4px 12px", fontSize: 11, background: "#e5e5e5", color: "#888", marginLeft: 4 }}>X</button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={i.id} style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }} onClick={function() { editId[1](i.id); editForm[1]({ cost: i.costPerUnit }); }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>{i.name}</td>
                    <td style={{ padding: "10px 14px" }}><Pill t={i.category} c="#1E40AF" /></td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>{fmt(i.costPerUnit)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#888" }}>{i.unit}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#ccc", fontSize: 11 }}>editar</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── PROVEEDORES TAB ──
  function renderProveedores() {
    var expandedSup = editId[0];
    var editingSup = editForm[0].editingSupId || null;
    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Click en un proveedor para desplegar ficha completa con productos, condiciones y datos.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {props.suppliers.map(function(s) {
            var isOpen = expandedSup === s.id;
            var isEditing = editingSup === s.id;
            // Get ingredients from this supplier
            var supIngs = props.ingredients.filter(function(i) { return i.supplierId === s.id; });
            var totalIngCost = 0;
            for (var ti = 0; ti < supIngs.length; ti++) totalIngCost += supIngs[ti].costPerUnit;

            return (
              <div key={s.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + (isOpen ? "#B4530940" : "#eee"), overflow: "hidden" }}>
                {/* Header row */}
                <div onClick={function() { editId[1](isOpen ? null : s.id); editForm[1]({}); }} style={{ display: "flex", alignItems: "center", padding: "16px 20px", cursor: "pointer", gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: isOpen ? "#B4530915" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isOpen ? "#B45309" : "#ccc", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{supIngs.length} ingredientes | {s.contact || "Sin contacto"} | {s.deliveryDays || ""}</div>
                  </div>
                  <Pill t={supIngs.length + " prod."} c="#1E40AF" />
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid #f0f0f0" }}>
                    {/* Quick info bar */}
                    <div style={{ display: "flex", gap: 12, padding: "14px 20px", background: "#fafaf8", flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 150px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>CONTACTO</div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{s.contact || "-"}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{s.phone || ""}</div>
                        {s.email && <div style={{ fontSize: 11, color: "#1E40AF" }}>{s.email}</div>}
                      </div>
                      <div style={{ flex: "1 1 150px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>ENTREGAS</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.deliveryDays || "-"}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>Min: {s.minOrder || "-"}</div>
                      </div>
                      <div style={{ flex: "1 1 150px", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee" }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 2 }}>PAGO</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.payTerms || "-"}</div>
                      </div>
                    </div>

                    {/* Commercial conditions */}
                    <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ padding: "12px 14px", borderRadius: 10, background: s.discount && s.discount !== "-" ? "#F0FDF4" : "#f9f9f9", borderLeft: "3px solid " + (s.discount && s.discount !== "-" ? "#047857" : "#e5e5e5") }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>DESCUENTO</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: s.discount && s.discount !== "-" ? "#047857" : "#aaa" }}>{s.discount || "Sin descuento"}</div>
                      </div>
                      <div style={{ padding: "12px 14px", borderRadius: 10, background: s.rappel && s.rappel !== "-" ? "#EFF6FF" : "#f9f9f9", borderLeft: "3px solid " + (s.rappel && s.rappel !== "-" ? "#1E40AF" : "#e5e5e5") }}>
                        <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>RAPPEL</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: s.rappel && s.rappel !== "-" ? "#1E40AF" : "#aaa" }}>{s.rappel || "Sin rappel"}</div>
                      </div>
                    </div>

                    {/* Notes */}
                    {s.commercialNotes && (
                      <div style={{ padding: "0 20px 14px" }}>
                        <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FFFBEB", borderLeft: "3px solid #D97706" }}>
                          <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>NOTAS COMERCIALES</div>
                          <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>{s.commercialNotes}</div>
                        </div>
                      </div>
                    )}

                    {/* Products from this supplier */}
                    <div style={{ padding: "0 20px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#1E40AF" }}>PRODUCTOS DE {s.name.toUpperCase()}</div>
                      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #eee", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead><tr style={{ background: "#fafaf8", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>INGREDIENTE</th>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#aaa", fontSize: 10 }}>CATEGORIA</th>
                            <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "#aaa", fontSize: 10 }}>COSTE</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#aaa", fontSize: 10 }}>UD</th>
                          </tr></thead>
                          <tbody>
                            {supIngs.sort(function(a, b) { return b.costPerUnit - a.costPerUnit; }).map(function(i) {
                              return (
                                <tr key={i.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{i.name}</td>
                                  <td style={{ padding: "8px 12px" }}><Pill t={i.category} c="#1E40AF" /></td>
                                  <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: i.costPerUnit > 15 ? "#DC2626" : "#333" }}>{fmt(i.costPerUnit)}</td>
                                  <td style={{ padding: "8px 12px", textAlign: "center", color: "#888" }}>{i.unit}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Edit button */}
                    <div style={{ padding: "0 20px 16px" }}>
                      <button onClick={function(e) { e.stopPropagation(); editForm[1]({ editingSupId: s.id, contact: s.contact, phone: s.phone, email: s.email, deliveryDays: s.deliveryDays, minOrder: s.minOrder, payTerms: s.payTerms, discount: s.discount, rappel: s.rappel, commercialNotes: s.commercialNotes, notes: s.notes }); }} style={{ ...btn, background: isEditing ? "#e5e5e5" : "#B45309", color: isEditing ? "#888" : "#fff" }}>{isEditing ? "Cancelar" : "Editar proveedor"}</button>
                    </div>

                    {/* Edit form */}
                    {isEditing && (
                      <div style={{ padding: "0 20px 20px" }}>
                        <div style={{ padding: 16, borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                            {[["contact","Contacto"],["phone","Telefono"],["email","Email"],["deliveryDays","Dias entrega"],["minOrder","Pedido minimo"],["payTerms","Pago"],["discount","Descuento"],["rappel","Rappel"]].map(function(f) {
                              var ef = editForm[0];
                              return (
                                <div key={f[0]}>
                                  <div style={{ fontSize: 10, fontWeight: 600, color: "#888", marginBottom: 3 }}>{f[1]}</div>
                                  <input value={ef[f[0]] || ""} onChange={function(e) { var next = Object.assign({}, ef); next[f[0]] = e.target.value; editForm[1](next); }} style={{ ...inp, padding: "7px 10px", fontSize: 13 }} />
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#888", marginBottom: 3 }}>Notas comerciales</div>
                            <textarea value={editForm[0].commercialNotes || ""} onChange={function(e) { editForm[1](Object.assign({}, editForm[0], { commercialNotes: e.target.value })); }} rows="2" style={{ ...inp, resize: "vertical", fontSize: 13 }} />
                          </div>
                          <button onClick={function() {
                            var ef = editForm[0];
                            var updated = props.suppliers.map(function(x) {
                              if (x.id !== s.id) return x;
                              return Object.assign({}, x, { contact: ef.contact, phone: ef.phone, email: ef.email, deliveryDays: ef.deliveryDays, minOrder: ef.minOrder, payTerms: ef.payTerms, discount: ef.discount, rappel: ef.rappel, commercialNotes: ef.commercialNotes });
                            });
                            props.setSup(updated);
                            editForm[1]({});
                          }} style={btn}>Guardar cambios</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── VENTAS SEMANALES TAB ──
  function renderVentas() {
    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Actualiza las ventas semanales para que la Matrix de Menu Engineering sea precisa.</div>
        <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>PRODUCTO</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>CAT.</th>
              <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>VENTAS/SEM</th>
              <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}></th>
            </tr></thead>
            <tbody>
              {props.products.map(function(p) {
                var isEditing = editId[0] === p.id;
                if (isEditing) {
                  var ef = editForm[0];
                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f0f0f0", background: "#FFFBEB" }}>
                      <td style={{ padding: "8px 14px", fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: "8px 14px" }}>{p.category}</td>
                      <td style={{ padding: "8px 14px" }}><input type="number" step="1" value={ef.sales || ""} onChange={function(e) { editForm[1]({ sales: e.target.value }); }} style={{ ...inp, width: 80, textAlign: "right", padding: "6px 8px" }} /></td>
                      <td style={{ padding: "8px 14px", textAlign: "center" }}>
                        <button onClick={function() {
                          var updated = props.products.map(function(x) { return x.id === p.id ? Object.assign({}, x, { weekSales: parseInt(ef.sales) || 0 }) : x; });
                          props.setProd(updated);
                          editId[1](null);
                        }} style={{ ...btn, padding: "4px 12px", fontSize: 11 }}>OK</button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }} onClick={function() { editId[1](p.id); editForm[1]({ sales: p.weekSales }); }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: "10px 14px" }}><Pill t={p.category} /></td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, fontSize: 16 }}>{p.weekSales || 0}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", color: "#ccc", fontSize: 11 }}>editar</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── EQUIPO TAB ──
  function renderEquipo() {
    var members = teamMembers[0];
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Gestiona encargados y empleados de cada local.</div>
          <button onClick={function() { addMode[1](!addMode[0]); newForm[1]({ name: "", role: "empleado", local: "San Luis", phone: "" }); }} style={btn}>{addMode[0] ? "Cancelar" : "+ Nuevo miembro"}</button>
        </div>

        {addMode[0] && (
          <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #047857" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Nuevo miembro</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Nombre</div>
                <input value={newForm[0].name || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { name: e.target.value })); }} style={inp} placeholder="Nombre" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Telefono</div>
                <input value={newForm[0].phone || ""} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { phone: e.target.value })); }} style={inp} placeholder="654 123 456" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Rol</div>
                <select value={newForm[0].role || "empleado"} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { role: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                  <option value="encargado">Encargado</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4 }}>Local</div>
                <select value={newForm[0].local || "San Luis"} onChange={function(e) { newForm[1](Object.assign({}, newForm[0], { local: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                  {LOCALS.map(function(l) { return <option key={l} value={l}>{l}</option>; })}
                </select>
              </div>
            </div>
            <button onClick={function() {
              if (!newForm[0].name.trim()) return;
              var member = { id: "t" + Date.now(), name: newForm[0].name.trim(), role: newForm[0].role, local: newForm[0].local, phone: newForm[0].phone, active: true };
              teamMembers[1](members.concat([member]));
              addMode[1](false);
            }} style={btn}>Guardar</button>
          </div>
        )}

        {LOCALS.map(function(local) {
          var localMembers = members.filter(function(m) { return m.local === local; });
          return (
            <div key={local} style={{ ...crd, marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{local}</div>
              {localMembers.length === 0 && <div style={{ color: "#ccc", fontSize: 13, padding: 8 }}>Sin personal asignado</div>}
              {localMembers.map(function(m) {
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: m.role === "encargado" ? "#047857" : "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{m.name[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{m.phone || "Sin telefono"}</div>
                    </div>
                    <Pill t={m.role} c={m.role === "encargado" ? "#047857" : "#1E40AF"} />
                    <button onClick={function() {
                      var next = members.filter(function(x) { return x.id !== m.id; });
                      teamMembers[1](next);
                    }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // ── PASOS PREPARACION TAB ──
  function renderPasos() {
    var ps = props.prepSteps;
    var allRecipes = props.recipes.filter(function(r) { return r.type === "escandallo"; });

    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Edita los pasos de preparacion de cada producto. Los encargados y empleados los veran en sus fichas.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allRecipes.map(function(r) {
            var isEditing = editingPasos[0] === r.id;
            var steps = ps[0][r.id] || [];
            var prodName = "";
            for (var pi = 0; pi < props.products.length; pi++) { if (props.products[pi].recipeId === r.id) { prodName = props.products[pi].name; break; } }

            return (
              <div key={r.id} style={{ ...crd, borderLeft: isEditing ? "4px solid #B45309" : "1px solid #eee" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isEditing ? 12 : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{prodName || r.name.replace("Esc ", "")}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{steps.length} pasos</div>
                  </div>
                  <button onClick={function() { editingPasos[1](isEditing ? null : r.id); newStepText[1](""); }} style={{ ...btn, padding: "6px 14px", fontSize: 12, background: isEditing ? "#e5e5e5" : "#B45309", color: isEditing ? "#888" : "#fff" }}>{isEditing ? "Cerrar" : "Editar pasos"}</button>
                </div>

                {isEditing && (
                  <div>
                    {/* Existing steps - draggable-like reorder */}
                    {steps.map(function(step, idx) {
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderBottom: "1px solid #f8f8f8" }}>
                          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#1E40AF10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1E40AF", flexShrink: 0 }}>{idx + 1}</div>
                          <div style={{ flex: 1, fontSize: 13 }}>{step}</div>
                          <button onClick={function() {
                            if (idx === 0) return;
                            var next = steps.slice();
                            var tmp = next[idx]; next[idx] = next[idx - 1]; next[idx - 1] = tmp;
                            var updated = Object.assign({}, ps[0]); updated[r.id] = next; ps[1](updated);
                          }} style={{ background: "none", border: "none", color: idx === 0 ? "#eee" : "#888", cursor: idx === 0 ? "default" : "pointer", fontSize: 14 }}>↑</button>
                          <button onClick={function() {
                            if (idx === steps.length - 1) return;
                            var next = steps.slice();
                            var tmp = next[idx]; next[idx] = next[idx + 1]; next[idx + 1] = tmp;
                            var updated = Object.assign({}, ps[0]); updated[r.id] = next; ps[1](updated);
                          }} style={{ background: "none", border: "none", color: idx === steps.length - 1 ? "#eee" : "#888", cursor: idx === steps.length - 1 ? "default" : "pointer", fontSize: 14 }}>↓</button>
                          <button onClick={function() {
                            var next = steps.filter(function(s, si) { return si !== idx; });
                            var updated = Object.assign({}, ps[0]); updated[r.id] = next; ps[1](updated);
                          }} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: 14 }}>x</button>
                        </div>
                      );
                    })}

                    {/* Add new step */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <input value={newStepText[0]} onChange={function(e) { newStepText[1](e.target.value); }} placeholder="Nuevo paso de preparacion..." style={{ ...inp, flex: 1, padding: "8px 12px", fontSize: 13 }} onKeyDown={function(e) {
                        if (e.key === "Enter" && newStepText[0].trim()) {
                          var next = (steps || []).concat([newStepText[0].trim()]);
                          var updated = Object.assign({}, ps[0]); updated[r.id] = next; ps[1](updated);
                          newStepText[1]("");
                        }
                      }} />
                      <button onClick={function() {
                        if (!newStepText[0].trim()) return;
                        var next = (steps || []).concat([newStepText[0].trim()]);
                        var updated = Object.assign({}, ps[0]); updated[r.id] = next; ps[1](updated);
                        newStepText[1]("");
                      }} style={{ ...btn, padding: "8px 14px", fontSize: 12 }}>+ Paso</button>
                    </div>

                    {steps.length === 0 && <div style={{ padding: 16, textAlign: "center", color: "#ccc", fontSize: 13 }}>Sin pasos aun. Anade el primer paso arriba.</div>}
                  </div>
                )}

                {!isEditing && steps.length > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
                    {steps.slice(0, 3).map(function(s, i) { return (i + 1) + ". " + s; }).join(" | ")}{steps.length > 3 ? " ..." : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── HISTORIAL PRECIOS TAB ──
  function renderHistorial() {
    var history = props.priceHistory[0];
    var filtered = filterIng[0] ? history.filter(function(h) { return h.ingredientName.toLowerCase().indexOf(filterIng[0].toLowerCase()) >= 0; }) : history;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Registro de cambios de precio de ingredientes. Se actualiza automaticamente al editar costes.</div>
          <input value={filterIng[0]} onChange={function(e) { filterIng[1](e.target.value); }} placeholder="Filtrar ingrediente..." style={{ ...inp, maxWidth: 240, padding: "8px 12px" }} />
        </div>

        {history.length === 0 && (
          <div style={{ ...crd, textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#888", marginBottom: 4 }}>Sin cambios registrados</div>
            <div style={{ fontSize: 13, color: "#aaa" }}>Cuando modifiques el precio de un ingrediente en la pestana de Ingredientes, el cambio quedara registrado aqui con fecha y variacion.</div>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>FECHA</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11 }}>INGREDIENTE</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>ANTERIOR</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, color: "#999", fontSize: 11 }}></th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>NUEVO</th>
                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, color: "#999", fontSize: 11 }}>VARIACION</th>
              </tr></thead>
              <tbody>
                {filtered.map(function(h) {
                  var up = h.newPrice > h.oldPrice;
                  var changeColor = up ? "#DC2626" : "#047857";
                  return (
                    <tr key={h.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "#888" }}>{h.date}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 600 }}>{h.ingredientName}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", color: "#888" }}>{fmt(h.oldPrice)}/{h.unit}</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 16, color: changeColor }}>{up ? "↑" : "↓"}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: changeColor }}>{fmt(h.newPrice)}/{h.unit}</td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: changeColor + "12", color: changeColor }}>
                          {up ? "+" : ""}{h.change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary by ingredient */}
        {history.length > 3 && (
          <div style={{ ...crd, marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Resumen de variaciones</div>
            {(function() {
              var byIng = {};
              for (var i = 0; i < history.length; i++) {
                var h = history[i];
                if (!byIng[h.ingredientId]) byIng[h.ingredientId] = { name: h.ingredientName, changes: 0, firstPrice: h.oldPrice, lastPrice: h.newPrice, unit: h.unit };
                byIng[h.ingredientId].changes++;
                byIng[h.ingredientId].lastPrice = h.newPrice;
              }
              var list = [];
              for (var k in byIng) list.push(byIng[k]);
              list.sort(function(a, b) { return b.changes - a.changes; });
              return list.map(function(s) {
                var totalChange = s.firstPrice > 0 ? ((s.lastPrice - s.firstPrice) / s.firstPrice * 100) : 0;
                var up = s.lastPrice > s.firstPrice;
                return (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 6px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{s.changes} cambio{s.changes > 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13 }}>{fmt(s.firstPrice)} → <strong style={{ color: up ? "#DC2626" : "#047857" }}>{fmt(s.lastPrice)}</strong>/{s.unit}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: up ? "#DC2626" : "#047857" }}>{up ? "+" : ""}{totalChange.toFixed(1)}% total</div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    );
  }

  // ── RESET TAB ──
  function renderReset() {
    return (
      <div style={crd}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>Reset a datos originales</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
          Esto borra todos los cambios que hayas hecho (precios, ventas semanales, proveedores, historico de precios) y vuelve a cargar los datos originales del Excel de escandallos. Las incidencias y alertas de stock tambien se borran.
        </div>
        {!confirmReset[0] ? (
          <button onClick={function() { confirmReset[1](true); }} style={{ ...btn, background: "#DC2626", padding: "12px 24px", fontSize: 15 }}>Resetear todo</button>
        ) : (
          <div style={{ padding: 20, borderRadius: 12, background: "#FEF2F2", border: "2px solid #DC2626" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>Seguro que quieres borrar TODOS los datos?</div>
            <div style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>Esta accion no se puede deshacer. Se pierden cambios de precios, ventas, proveedores, equipo, incidencias y alertas.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={function() {
                var seed = makeSeed();
                props.setSup(seed.suppliers);
                props.setIng(seed.ingredients);
                props.setRec(seed.recipes);
                props.setProd(seed.products);
                props.stockAlerts[1]([]);
                props.incidents[1]([]);
                props.priceHistory[1]([]);
                confirmReset[1](false);
              }} style={{ ...btn, background: "#DC2626", padding: "12px 24px", fontSize: 15 }}>SI, BORRAR TODO</button>
              <button onClick={function() { confirmReset[1](false); }} style={{ ...btn, background: "#fff", color: "#888", border: "1px solid #e5e5e5", padding: "12px 24px", fontSize: 15 }}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Gestion</div>
        <div style={{ fontSize: 13, color: "#888" }}>Administra productos, precios, ingredientes, proveedores y equipo</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(function(t) {
          var active = tab[0] === t.k;
          return <button key={t.k} onClick={function() { tab[1](t.k); editId[1](null); addMode[1](false); }} style={{ padding: "8px 18px", borderRadius: 10, border: active ? "2px solid #B45309" : "1px solid #e5e5e5", background: active ? "#B4530908" : "#fff", color: active ? "#B45309" : "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.l}</button>;
        })}
      </div>

      {tab[0] === "productos" && renderProductos()}
      {tab[0] === "ingredientes" && renderIngredientes()}
      {tab[0] === "proveedores" && renderProveedores()}
      {tab[0] === "ventas" && renderVentas()}
      {tab[0] === "equipo" && renderEquipo()}
      {tab[0] === "pasos" && renderPasos()}
      {tab[0] === "historial" && renderHistorial()}
      {tab[0] === "reset" && renderReset()}
    </div>
  );
}

/* ====== I+D ====== */
function IDView(props) {
  var tab = useState("lab");
  var tabs = [
    { k: "lab", l: "Lab Recetas" },
    { k: "alternativas", l: "Alternativas" },
    { k: "ideas", l: "Ideas" },
    { k: "whatif", l: "What If Menu" },
  ];

  // Shared state
  var labItems = useState([]);
  var labName = useState("");
  var labPrice = useState("");
  var labSaved = useState([]);
  var manualIng = useState(false);
  var manualForm = useState({ name: "", cost: "", unit: "kg" });
  var alternatives = useState([
    { id: "alt1", current: "Heura Vegano", currentCost: 43.45, currentUnit: "kg", alt: "Tofu firme", altCost: 3.80, altUnit: "kg", notes: "Mucho mas barato pero textura diferente. Probar marinado con especias mexicanas.", status: "por probar" },
    { id: "alt2", current: "Pollo Braseado (Atlanta)", currentCost: 15.73, currentUnit: "kg", alt: "Pollo braseado casero", altCost: 9.50, altUnit: "kg", notes: "Comprar pechuga a 7.80 + preparacion interna. Ahorro 6.23/kg pero requiere tiempo.", status: "en prueba" },
    { id: "alt3", current: "Salsa Cheddar USA", currentCost: 15.28, currentUnit: "kg", alt: "Cheddar casero fundido", altCost: 8.50, altUnit: "kg", notes: "Mezcla de quesos propios. Necesita receta estandarizada.", status: "idea" },
  ]);
  var ideas = props.ideasState;
  var excludedProds = useState({});
  var newAlt = useState(false);
  var altForm = useState({ current: "", currentCost: "", currentUnit: "kg", alt: "", altCost: "", altUnit: "kg", notes: "" });
  var newIdea = useState(false);
  var ideaForm = useState({ title: "", desc: "", category: "nuevo producto" });

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };
  var btn = { padding: "8px 18px", background: "#B45309", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

  // ── LAB RECETAS ──
  function renderLab() {
    // Calculate test recipe cost
    var totalCost = 0;
    for (var i = 0; i < labItems[0].length; i++) {
      totalCost += labItems[0][i].lineCost || 0;
    }
    var testPrice = parseFloat(labPrice[0]) || 0;
    var testFC = testPrice > 0 ? (totalCost / testPrice) * 100 : 0;
    var testMargin = testPrice > 0 ? testPrice - totalCost : 0;

    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Crea recetas de prueba con ingredientes existentes. Calcula el coste y viabilidad antes de meterla en carta.</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {/* Builder */}
          <div style={crd}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Receta de prueba</div>
              {labItems[0].length > 0 && <button onClick={function() { labItems[1]([]); labName[1](""); labPrice[1](""); }} style={{ ...btn, background: "#e5e5e5", color: "#888", padding: "4px 12px", fontSize: 11 }}>Limpiar</button>}
            </div>
            <input value={labName[0]} onChange={function(e) { labName[1](e.target.value); }} placeholder="Nombre de la receta de prueba..." style={{ ...inp, marginBottom: 10, fontWeight: 600 }} />

            <select onChange={function(e) {
              if (!e.target.value) return;
              var ingId = e.target.value;
              var ing = null;
              for (var k = 0; k < props.ingredients.length; k++) { if (props.ingredients[k].id === ingId) { ing = props.ingredients[k]; break; } }
              if (!ing) return;
              labItems[1](labItems[0].concat([{ id: Math.random().toString(36).slice(2), ingId: ingId, name: ing.name, unit: ing.unit, costPerUnit: ing.costPerUnit, grams: 100, lineCost: ing.unit === "ud" ? ing.costPerUnit : ing.costPerUnit * 0.1, manual: false }]));
              e.target.value = "";
            }} style={{ ...inp, background: "#fff", marginBottom: 8 }}>
              <option value="">+ Agregar ingrediente del sistema...</option>
              {props.ingredients.map(function(i) { return <option key={i.id} value={i.id}>{i.name} ({fmt(i.costPerUnit)}/{i.unit})</option>; })}
            </select>

            {/* Manual ingredient toggle */}
            {!manualIng[0] ? (
              <button onClick={function() { manualIng[1](true); }} style={{ ...btn, background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "6px 14px", fontSize: 12, width: "100%", marginBottom: 12 }}>+ Ingrediente manual (no esta en sistema)</button>
            ) : (
              <div style={{ padding: 12, borderRadius: 10, background: "#EFF6FF", border: "1px solid #BFDBFE", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <input value={manualForm[0].name} onChange={function(e) { manualForm[1](Object.assign({}, manualForm[0], { name: e.target.value })); }} style={{ ...inp, flex: 2, padding: "8px 10px", fontSize: 13 }} placeholder="Nombre ingrediente" />
                  <input type="number" step="0.01" value={manualForm[0].cost} onChange={function(e) { manualForm[1](Object.assign({}, manualForm[0], { cost: e.target.value })); }} style={{ ...inp, flex: 1, padding: "8px 10px", fontSize: 13, textAlign: "right" }} placeholder="Coste" />
                  <select value={manualForm[0].unit} onChange={function(e) { manualForm[1](Object.assign({}, manualForm[0], { unit: e.target.value })); }} style={{ ...inp, width: 60, padding: "8px 6px", fontSize: 13, background: "#fff" }}>
                    <option value="kg">kg</option><option value="ud">ud</option><option value="L">L</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={function() {
                    if (!manualForm[0].name.trim() || !manualForm[0].cost) return;
                    var mc = parseFloat(manualForm[0].cost) || 0;
                    labItems[1](labItems[0].concat([{ id: Math.random().toString(36).slice(2), ingId: null, name: manualForm[0].name.trim() + " *", unit: manualForm[0].unit, costPerUnit: mc, grams: 100, lineCost: manualForm[0].unit === "ud" ? mc : mc * 0.1, manual: true }]));
                    manualForm[1]({ name: "", cost: "", unit: "kg" });
                    manualIng[1](false);
                  }} style={{ ...btn, padding: "6px 14px", fontSize: 12 }}>Anadir</button>
                  <button onClick={function() { manualIng[1](false); }} style={{ ...btn, background: "#e5e5e5", color: "#888", padding: "6px 14px", fontSize: 12 }}>Cancelar</button>
                </div>
              </div>
            )}

            {labItems[0].map(function(item, idx) {
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", borderBottom: "1px solid #f8f8f8" }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: item.manual ? "#1E40AF" : "#333" }}>{item.name}</div>
                  <input type="number" value={item.grams} onChange={function(e) {
                    var g = parseFloat(e.target.value) || 0;
                    var next = labItems[0].map(function(x, xi) {
                      if (xi !== idx) return x;
                      var lc = x.unit === "ud" ? x.costPerUnit * g : x.costPerUnit * (g / 1000);
                      return Object.assign({}, x, { grams: g, lineCost: lc });
                    });
                    labItems[1](next);
                  }} style={{ width: 60, padding: "4px 8px", border: "1px solid #e5e5e5", borderRadius: 6, textAlign: "right", fontSize: 13, fontFamily: "inherit" }} />
                  <span style={{ fontSize: 11, color: "#888", minWidth: 20 }}>{item.unit === "ud" ? "ud" : "g"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, minWidth: 50, textAlign: "right" }}>{fmt(item.lineCost)}</span>
                  <button onClick={function() { labItems[1](labItems[0].filter(function(x, xi) { return xi !== idx; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
                </div>
              );
            })}

            {labItems[0].length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6 }}>PVP de prueba</div>
                <input type="number" step="0.5" value={labPrice[0]} onChange={function(e) { labPrice[1](e.target.value); }} style={{ ...inp, textAlign: "center", fontSize: 16, fontWeight: 700 }} placeholder="Ej: 9.90" />
              </div>
            )}
          </div>

          {/* Results */}
          <div style={crd}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Resultado</div>
            {labItems[0].length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#ccc", fontSize: 13 }}>Agrega ingredientes para ver el coste</div>}

            {labItems[0].length > 0 && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 16, borderRadius: 10, background: "#f9f9f6", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>COSTE MP</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#B45309" }}>{fmt(totalCost)}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{labItems[0].length} ingredientes</div>
                  </div>
                  {testPrice > 0 && (
                    <div style={{ padding: 16, borderRadius: 10, background: testFC > 35 ? "#FEF2F2" : "#F0FDF4", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginBottom: 4 }}>FOOD COST</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: testFC > 35 ? "#DC2626" : testFC > 30 ? "#D97706" : "#047857" }}>{fPct(testFC)}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>Margen: {fmt(testMargin)}</div>
                    </div>
                  )}
                </div>

                {testPrice > 0 && (
                  <div style={{ padding: 14, borderRadius: 10, background: testFC > 35 ? "#FEF2F2" : testFC > 30 ? "#FFFBEB" : "#F0FDF4", borderLeft: "3px solid " + (testFC > 35 ? "#DC2626" : testFC > 30 ? "#D97706" : "#047857") }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: testFC > 35 ? "#991B1B" : testFC > 30 ? "#92400E" : "#065F46" }}>
                      {testFC > 40 ? "No viable - FC demasiado alto" : testFC > 35 ? "Ajustado - revisar ingredientes o subir precio" : testFC > 30 ? "Viable pero justo - margen limitado" : testFC > 25 ? "Buen producto - margen saludable" : "Excelente margen - listo para carta"}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      Precio ideal para FC 30%: <strong>{fmt(totalCost / 0.30)}</strong> | Precio minimo para FC 35%: <strong>{fmt(totalCost / 0.35)}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save button */}
            {labItems[0].length > 0 && labName[0].trim() && (
              <button onClick={function() {
                labSaved[1](labSaved[0].concat([{
                  id: "lab" + Date.now(), name: labName[0].trim(), items: labItems[0].slice(),
                  cost: totalCost, price: testPrice, fc: testFC, margin: testMargin,
                  date: new Date().toLocaleDateString(),
                  viable: testPrice > 0 ? (testFC < 35) : null
                }]));
                labItems[1]([]); labName[1](""); labPrice[1]("");
              }} style={{ ...btn, width: "100%", marginTop: 12, background: "#047857", padding: 12, fontSize: 14 }}>Guardar receta de prueba</button>
            )}
          </div>
        </div>

        {/* Saved recipes */}
        {labSaved[0].length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Recetas guardadas ({labSaved[0].length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {labSaved[0].map(function(sr) {
                var hasManual = false;
                for (var mi = 0; mi < sr.items.length; mi++) { if (sr.items[mi].manual) { hasManual = true; break; } }
                return (
                  <div key={sr.id} style={{ ...crd, borderLeft: "4px solid " + (sr.viable === null ? "#888" : sr.viable ? "#047857" : "#DC2626") }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{sr.name}</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{sr.date} | {sr.items.length} ingredientes{hasManual ? " (con manuales)" : ""}</div>
                      </div>
                      <button onClick={function() { labSaved[1](labSaved[0].filter(function(x) { return x.id !== sr.id; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <div style={{ padding: "6px 12px", borderRadius: 8, background: "#f9f9f6", flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "#888" }}>COSTE</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#B45309" }}>{fmt(sr.cost)}</div>
                      </div>
                      {sr.price > 0 && (
                        <div style={{ padding: "6px 12px", borderRadius: 8, background: sr.fc > 35 ? "#FEF2F2" : "#F0FDF4", flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#888" }}>FC</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: sr.fc > 35 ? "#DC2626" : "#047857" }}>{fPct(sr.fc)}</div>
                        </div>
                      )}
                      {sr.price > 0 && (
                        <div style={{ padding: "6px 12px", borderRadius: 8, background: "#f9f9f6", flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#888" }}>PVP</div>
                          <div style={{ fontSize: 14, fontWeight: 800 }}>{fmt(sr.price)}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {sr.items.map(function(it) { return it.name; }).join(", ")}
                    </div>
                    {/* Load back into lab */}
                    <button onClick={function() { labItems[1](sr.items.slice()); labName[1](sr.name); labPrice[1](sr.price ? String(sr.price) : ""); }} style={{ ...btn, background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "5px 12px", fontSize: 11, marginTop: 8 }}>Cargar en lab</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
  function renderAlternativas() {
    var statusColors = { "idea": "#888", "por probar": "#D97706", "en prueba": "#1E40AF", "aprobado": "#047857", "descartado": "#DC2626" };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Compara ingredientes actuales con alternativas mas baratas o de mejor calidad.</div>
          <button onClick={function() { newAlt[1](!newAlt[0]); }} style={btn}>{newAlt[0] ? "Cancelar" : "+ Nueva comparativa"}</button>
        </div>

        {newAlt[0] && (
          <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #7C3AED" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>INGREDIENTE ACTUAL</div>
                <input value={altForm[0].current} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { current: e.target.value })); }} style={{ ...inp, marginBottom: 6 }} placeholder="Ej: Heura Vegano" />
                <div style={{ display: "flex", gap: 6 }}>
                  <input type="number" step="0.01" value={altForm[0].currentCost} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { currentCost: e.target.value })); }} style={{ ...inp, flex: 1 }} placeholder="Coste" />
                  <select value={altForm[0].currentUnit} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { currentUnit: e.target.value })); }} style={{ ...inp, width: 70, background: "#fff" }}>
                    <option value="kg">kg</option><option value="ud">ud</option><option value="L">L</option>
                  </select>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#047857", marginBottom: 8 }}>ALTERNATIVA</div>
                <input value={altForm[0].alt} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { alt: e.target.value })); }} style={{ ...inp, marginBottom: 6 }} placeholder="Ej: Tofu firme" />
                <div style={{ display: "flex", gap: 6 }}>
                  <input type="number" step="0.01" value={altForm[0].altCost} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { altCost: e.target.value })); }} style={{ ...inp, flex: 1 }} placeholder="Coste" />
                  <select value={altForm[0].altUnit} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { altUnit: e.target.value })); }} style={{ ...inp, width: 70, background: "#fff" }}>
                    <option value="kg">kg</option><option value="ud">ud</option><option value="L">L</option>
                  </select>
                </div>
              </div>
            </div>
            <textarea value={altForm[0].notes} onChange={function(e) { altForm[1](Object.assign({}, altForm[0], { notes: e.target.value })); }} placeholder="Notas: calidad, sabor, proveedor..." rows="2" style={{ ...inp, marginTop: 10, resize: "vertical" }} />
            <button onClick={function() {
              if (!altForm[0].current || !altForm[0].alt) return;
              alternatives[1](alternatives[0].concat([{ id: "alt" + Date.now(), current: altForm[0].current, currentCost: parseFloat(altForm[0].currentCost) || 0, currentUnit: altForm[0].currentUnit, alt: altForm[0].alt, altCost: parseFloat(altForm[0].altCost) || 0, altUnit: altForm[0].altUnit, notes: altForm[0].notes, status: "idea" }]));
              newAlt[1](false);
              altForm[1]({ current: "", currentCost: "", currentUnit: "kg", alt: "", altCost: "", altUnit: "kg", notes: "" });
            }} style={{ ...btn, marginTop: 10 }}>Guardar comparativa</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alternatives[0].map(function(a) {
            var saving = a.currentCost > 0 ? ((a.currentCost - a.altCost) / a.currentCost * 100) : 0;
            var sc = statusColors[a.status] || "#888";
            return (
              <div key={a.id} style={crd}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>{a.current}</span>
                      <span style={{ fontSize: 16, color: "#888" }}>vs</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#047857" }}>{a.alt}</span>
                    </div>
                  </div>
                  <select value={a.status} onChange={function(e) {
                    alternatives[1](alternatives[0].map(function(x) { return x.id === a.id ? Object.assign({}, x, { status: e.target.value }) : x; }));
                  }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontWeight: 600, color: sc, fontFamily: "inherit", background: "#fff" }}>
                    <option value="idea">Idea</option>
                    <option value="por probar">Por probar</option>
                    <option value="en prueba">En prueba</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="descartado">Descartado</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                  <div style={{ padding: "10px 16px", borderRadius: 10, background: "#FEF2F2", textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>ACTUAL</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#DC2626" }}>{fmt(a.currentCost)}<span style={{ fontSize: 12 }}>/{a.currentUnit}</span></div>
                  </div>
                  <div style={{ padding: "10px 16px", borderRadius: 10, background: "#F0FDF4", textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>ALTERNATIVA</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#047857" }}>{fmt(a.altCost)}<span style={{ fontSize: 12 }}>/{a.altUnit}</span></div>
                  </div>
                  <div style={{ padding: "10px 16px", borderRadius: 10, background: saving > 0 ? "#F0FDF4" : "#FEF2F2", textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>AHORRO</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: saving > 0 ? "#047857" : "#DC2626" }}>{saving > 0 ? "-" : "+"}{Math.abs(saving).toFixed(0)}%</div>
                  </div>
                </div>
                {a.notes && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, padding: "8px 0", borderTop: "1px solid #f5f5f5" }}>{a.notes}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── IDEAS ──
  function renderIdeas() {
    var statusColors = { "idea": "#888", "por probar": "#D97706", "en prueba": "#1E40AF", "aprobado": "#047857", "descartado": "#DC2626" };
    var catEmojis = { "nuevo producto": "🌮", "optimizacion": "📉", "marketing": "📣", "operaciones": "⚙️", "otro": "💡" };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#888" }}>Apunta ideas para nuevos productos, optimizaciones y mejoras.</div>
          <button onClick={function() { newIdea[1](!newIdea[0]); }} style={btn}>{newIdea[0] ? "Cancelar" : "+ Nueva idea"}</button>
        </div>

        {newIdea[0] && (
          <div style={{ ...crd, marginBottom: 16, borderLeft: "4px solid #F59E0B" }}>
            <input value={ideaForm[0].title} onChange={function(e) { ideaForm[1](Object.assign({}, ideaForm[0], { title: e.target.value })); }} style={{ ...inp, marginBottom: 8, fontWeight: 700, fontSize: 16 }} placeholder="Titulo de la idea" />
            <textarea value={ideaForm[0].desc} onChange={function(e) { ideaForm[1](Object.assign({}, ideaForm[0], { desc: e.target.value })); }} rows="3" style={{ ...inp, marginBottom: 8, resize: "vertical" }} placeholder="Describe la idea, por que, beneficio esperado..." />
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {["nuevo producto", "optimizacion", "marketing", "operaciones", "otro"].map(function(c) {
                return <button key={c} onClick={function() { ideaForm[1](Object.assign({}, ideaForm[0], { category: c })); }} style={{ padding: "6px 12px", borderRadius: 6, border: ideaForm[0].category === c ? "2px solid #B45309" : "1px solid #e5e5e5", background: ideaForm[0].category === c ? "#B4530908" : "#fff", color: ideaForm[0].category === c ? "#B45309" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{catEmojis[c] || "💡"} {c}</button>;
              })}
            </div>
            <button onClick={function() {
              if (!ideaForm[0].title.trim()) return;
              ideas[1]([{ id: "idea" + Date.now(), title: ideaForm[0].title.trim(), desc: ideaForm[0].desc.trim(), category: ideaForm[0].category, status: "idea", date: new Date().toLocaleDateString(), assignedTo: "", feedback: "" }].concat(ideas[0]));
              newIdea[1](false);
              ideaForm[1]({ title: "", desc: "", category: "nuevo producto" });
            }} style={btn}>Guardar idea</button>
          </div>
        )}

        {/* Status summary */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["idea", "por probar", "en prueba", "aprobado", "descartado"].map(function(s) {
            var count = ideas[0].filter(function(x) { return x.status === s; }).length;
            return <div key={s} style={{ padding: "6px 14px", borderRadius: 8, background: count > 0 ? statusColors[s] + "12" : "#f5f5f5", fontSize: 12, fontWeight: 600, color: count > 0 ? statusColors[s] : "#ccc" }}>{s}: {count}</div>;
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ideas[0].map(function(idea) {
            var sc = statusColors[idea.status] || "#888";
            var teamNames = props.team ? props.team[0] || [] : [];
            var encargados = [];
            for (var ei = 0; ei < teamNames.length; ei++) { if (teamNames[ei].role === "encargado") encargados.push(teamNames[ei]); }
            return (
              <div key={idea.id} style={{ ...crd, borderLeft: "4px solid " + sc }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{catEmojis[idea.category] || "💡"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{idea.title}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{idea.category} | {idea.date}</div>
                  </div>
                  <select value={idea.status} onChange={function(e) {
                    ideas[1](ideas[0].map(function(x) { return x.id === idea.id ? Object.assign({}, x, { status: e.target.value }) : x; }));
                  }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontWeight: 600, color: sc, fontFamily: "inherit", background: "#fff" }}>
                    <option value="idea">Idea</option>
                    <option value="por probar">Por probar</option>
                    <option value="en prueba">En prueba</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="descartado">Descartado</option>
                  </select>
                  <button onClick={function() { ideas[1](ideas[0].filter(function(x) { return x.id !== idea.id; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
                </div>
                {idea.desc && <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, paddingLeft: 30, marginBottom: 8 }}>{idea.desc}</div>}
                <div style={{ display: "flex", gap: 10, alignItems: "center", paddingLeft: 30, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>Asignar a:</span>
                    <select value={idea.assignedTo || ""} onChange={function(e) {
                      ideas[1](ideas[0].map(function(x) { return x.id === idea.id ? Object.assign({}, x, { assignedTo: e.target.value }) : x; }));
                    }} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontFamily: "inherit", background: "#fff", color: idea.assignedTo ? "#047857" : "#aaa" }}>
                      <option value="">Sin asignar</option>
                      {encargados.map(function(enc) { return <option key={enc.id} value={enc.name}>{enc.name} ({enc.local})</option>; })}
                    </select>
                  </div>
                  {idea.assignedTo && <Pill t={"Asignado: " + idea.assignedTo} c="#047857" />}
                </div>
                {idea.feedback && (
                  <div style={{ marginTop: 8, marginLeft: 30, padding: "8px 12px", borderRadius: 8, background: "#EFF6FF", borderLeft: "3px solid #1E40AF" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#1E40AF" }}>FEEDBACK DEL ENCARGADO</div>
                    <div style={{ fontSize: 12, color: "#333", marginTop: 2 }}>{idea.feedback}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── WHAT IF MENU ──
  function renderWhatIf() {
    var excluded = excludedProds[0];
    var currentProducts = props.products;
    var simProducts = currentProducts.filter(function(p) { return !excluded[p.id]; });

    // Calculate current vs simulated averages
    function calcAvg(list) {
      var totalFC = 0; var totalMargin = 0; var totalRevenue = 0; var count = 0;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        var cost = props.getPC(p);
        var sala = p.prices ? (p.prices.Sala || 0) : 0;
        if (sala <= 0) continue;
        var fc = (cost / sala) * 100;
        var margin = sala - cost;
        totalFC += fc; totalMargin += margin; totalRevenue += sala * (p.weekSales || 0);
        count++;
      }
      return { avgFC: count > 0 ? totalFC / count : 0, avgMargin: count > 0 ? totalMargin / count : 0, weekRevenue: totalRevenue, count: count };
    }
    var current = calcAvg(currentProducts);
    var simulated = calcAvg(simProducts);

    return (
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Simula como cambiaria tu carta si quitas productos. Compara FC medio, margen y revenue.</div>

        {/* Comparison KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ ...crd, background: "#fafaf8" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10 }}>CARTA ACTUAL ({current.count} productos)</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>FC Medio</div><div style={{ fontSize: 20, fontWeight: 800 }}>{fPct(current.avgFC)}</div></div>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>Margen Medio</div><div style={{ fontSize: 20, fontWeight: 800, color: "#047857" }}>{fmt(current.avgMargin)}</div></div>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>Revenue/sem</div><div style={{ fontSize: 20, fontWeight: 800 }}>{fmt(current.weekRevenue)}</div></div>
            </div>
          </div>
          <div style={{ ...crd, background: simulated.count < current.count ? "#F0FDF408" : "#fafaf8", borderLeft: "4px solid " + (simulated.avgFC < current.avgFC ? "#047857" : "#D97706") }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 10 }}>CARTA SIMULADA ({simulated.count} productos)</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>FC Medio</div><div style={{ fontSize: 20, fontWeight: 800, color: simulated.avgFC < current.avgFC ? "#047857" : "#D97706" }}>{fPct(simulated.avgFC)}</div></div>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>Margen Medio</div><div style={{ fontSize: 20, fontWeight: 800, color: "#047857" }}>{fmt(simulated.avgMargin)}</div></div>
              <div><div style={{ fontSize: 10, color: "#aaa" }}>Revenue/sem</div><div style={{ fontSize: 20, fontWeight: 800, color: simulated.weekRevenue < current.weekRevenue ? "#DC2626" : "#333" }}>{fmt(simulated.weekRevenue)}</div></div>
            </div>
          </div>
        </div>

        {/* Product toggle list */}
        <div style={crd}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Click para quitar/devolver productos de la carta simulada</div>
          {currentProducts.map(function(p) {
            var isExcluded = !!excluded[p.id];
            var cost = props.getPC(p);
            var sala = p.prices ? (p.prices.Sala || 0) : 0;
            var fc = sala > 0 ? (cost / sala) * 100 : 0;
            return (
              <div key={p.id} onClick={function() {
                var next = {};
                for (var k in excluded) next[k] = excluded[k];
                if (next[p.id]) { delete next[p.id]; } else { next[p.id] = true; }
                excludedProds[1](next);
              }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", opacity: isExcluded ? 0.35 : 1, textDecoration: isExcluded ? "line-through" : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (isExcluded ? "#DC2626" : "#047857"), background: isExcluded ? "#FEE2E2" : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isExcluded ? "#DC2626" : "#047857", flexShrink: 0 }}>{isExcluded ? "x" : "O"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.category} | {p.weekSales || 0} ventas/sem</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: fc > 35 ? "#DC2626" : "#047857" }}>FC {fPct(fc)}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{fmt(sala)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>I+D - Investigacion y Desarrollo</div>
        <div style={{ fontSize: 13, color: "#888" }}>Prueba recetas, compara ingredientes, apunta ideas y simula cambios en la carta</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(function(t) {
          var active = tab[0] === t.k;
          return <button key={t.k} onClick={function() { tab[1](t.k); }} style={{ padding: "8px 18px", borderRadius: 10, border: active ? "2px solid #B45309" : "1px solid #e5e5e5", background: active ? "#B4530908" : "#fff", color: active ? "#B45309" : "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.l}</button>;
        })}
      </div>
      {tab[0] === "lab" && renderLab()}
      {tab[0] === "alternativas" && renderAlternativas()}
      {tab[0] === "ideas" && renderIdeas()}
      {tab[0] === "whatif" && renderWhatIf()}
    </div>
  );
}

/* ====== TAREAS I+D (Encargado) ====== */
function TareasIDView(props) {
  var ideas = props.ideasState;
  var myName = props.user ? props.user.name : "";
  var feedbackEdit = useState(null);
  var feedbackText = useState("");

  // Filter ideas assigned to this encargado
  var myTasks = ideas[0].filter(function(x) { return x.assignedTo === myName; });
  var otherTasks = ideas[0].filter(function(x) { return x.assignedTo && x.assignedTo !== myName; });

  var statusColors = { "idea": "#888", "por probar": "#D97706", "en prueba": "#1E40AF", "aprobado": "#047857", "descartado": "#DC2626" };
  var statusEmojis = { "idea": "💡", "por probar": "🔍", "en prueba": "🧪", "aprobado": "✅", "descartado": "❌" };
  var catEmojis = { "nuevo producto": "🌮", "optimizacion": "📉", "marketing": "📣", "operaciones": "⚙️", "otro": "💡" };
  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  function updateIdea(id, changes) {
    ideas[1](ideas[0].map(function(x) { return x.id === id ? Object.assign({}, x, changes) : x; }));
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tareas I+D</div>
        <div style={{ fontSize: 13, color: "#888" }}>Ideas y pruebas asignadas por los socios. Actualiza el estado y anade feedback.</div>
      </div>

      {/* Quick KPIs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ ...crd, padding: "14px 20px", textAlign: "center", flex: "1 1 120px", borderTop: "4px solid #1E40AF" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1E40AF" }}>{myTasks.length}</div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Asignadas a mi</div>
        </div>
        <div style={{ ...crd, padding: "14px 20px", textAlign: "center", flex: "1 1 120px", borderTop: "4px solid #D97706" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#D97706" }}>{myTasks.filter(function(x) { return x.status === "por probar"; }).length}</div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Por probar</div>
        </div>
        <div style={{ ...crd, padding: "14px 20px", textAlign: "center", flex: "1 1 120px", borderTop: "4px solid #1E40AF" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1E40AF" }}>{myTasks.filter(function(x) { return x.status === "en prueba"; }).length}</div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>En prueba</div>
        </div>
        <div style={{ ...crd, padding: "14px 20px", textAlign: "center", flex: "1 1 120px", borderTop: "4px solid #047857" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#047857" }}>{myTasks.filter(function(x) { return x.status === "aprobado"; }).length}</div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Completadas</div>
        </div>
      </div>

      {/* My tasks */}
      {myTasks.length === 0 && (
        <div style={{ ...crd, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#888", marginBottom: 4 }}>Sin tareas asignadas</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>Cuando un socio te asigne una idea o prueba, aparecera aqui.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {myTasks.map(function(idea) {
          var sc = statusColors[idea.status] || "#888";
          var isEditingFeedback = feedbackEdit[0] === idea.id;

          return (
            <div key={idea.id} style={{ ...crd, borderLeft: "4px solid " + sc }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{catEmojis[idea.category] || "💡"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{idea.title}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{idea.category} | Creada: {idea.date}</div>
                </div>
                <span style={{ fontSize: 16 }}>{statusEmojis[idea.status] || ""}</span>
                <Pill t={idea.status} c={sc} />
              </div>

              {/* Description */}
              {idea.desc && (
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "#fafaf8", marginBottom: 12, fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#888", marginBottom: 4 }}>INSTRUCCIONES DEL SOCIO</div>
                  {idea.desc}
                </div>
              )}

              {/* Status update */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {["por probar", "en prueba", "aprobado", "descartado"].map(function(st) {
                  var active = idea.status === st;
                  return (
                    <button key={st} onClick={function() { updateIdea(idea.id, { status: st }); }} style={{ padding: "6px 14px", borderRadius: 8, border: active ? "2px solid " + (statusColors[st] || "#888") : "1px solid #e5e5e5", background: active ? (statusColors[st] || "#888") + "12" : "#fff", color: active ? (statusColors[st] || "#888") : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {statusEmojis[st]} {st}
                    </button>
                  );
                })}
              </div>

              {/* Existing feedback */}
              {idea.feedback && !isEditingFeedback && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#EFF6FF", borderLeft: "3px solid #1E40AF", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#1E40AF", marginBottom: 2 }}>MI FEEDBACK</div>
                  <div style={{ fontSize: 13, color: "#333" }}>{idea.feedback}</div>
                </div>
              )}

              {/* Add/edit feedback */}
              {isEditingFeedback ? (
                <div>
                  <textarea value={feedbackText[0]} onChange={function(e) { feedbackText[1](e.target.value); }} rows="3" placeholder="Escribe tu feedback: como salio la prueba, que funciono, que no, sugerencias..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #1E40AF", borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 8 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={function() {
                      updateIdea(idea.id, { feedback: feedbackText[0].trim() });
                      feedbackEdit[1](null);
                    }} style={{ padding: "8px 18px", background: "#1E40AF", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Guardar feedback</button>
                    <button onClick={function() { feedbackEdit[1](null); }} style={{ padding: "8px 18px", background: "#e5e5e5", color: "#888", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={function() { feedbackEdit[1](idea.id); feedbackText[1](idea.feedback || ""); }} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #1E40AF", background: "#EFF6FF", color: "#1E40AF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {idea.feedback ? "Editar feedback" : "Anadir feedback"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Other encargados tasks - view only */}
      {otherTasks.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#888", marginBottom: 10 }}>Tareas de otros encargados</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {otherTasks.map(function(idea) {
              var sc = statusColors[idea.status] || "#888";
              return (
                <div key={idea.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #f0f0f0", opacity: 0.7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{catEmojis[idea.category] || "💡"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{idea.title}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>Asignado a: {idea.assignedTo}</div>
                    </div>
                    <Pill t={idea.status} c={sc} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== TURNOS (Encargado) ====== */
function TurnosView(props) {
  var DAYS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  var SHIFTS = [
    { k: "manana", l: "Manana", time: "10:00-16:00", color: "#D97706" },
    { k: "tarde", l: "Tarde", time: "16:00-23:00", color: "#1E40AF" },
  ];

  // Get employees for this local
  var myLocal = props.user ? props.user.local : "";
  var teamAll = props.team ? props.team[0] || [] : [];
  var myTeam = teamAll.filter(function(m) { return (m.local === myLocal || !myLocal) && (m.role === "empleado" || m.role === "encargado"); });

  var schedule = useState({});
  var addingCell = useState(null);
  var wt = props.weekTasks;
  var taskForm = useState({ person: "", day: "Lunes", task: "" });

  function cellKey(day, shift) { return day + "|" + shift; }

  function getAssigned(day, shift) {
    var key = cellKey(day, shift);
    return schedule[0][key] || [];
  }

  function togglePerson(day, shift, personName) {
    var key = cellKey(day, shift);
    var current = schedule[0][key] || [];
    var exists = false;
    for (var i = 0; i < current.length; i++) { if (current[i] === personName) { exists = true; break; } }
    var next = Object.assign({}, schedule[0]);
    if (exists) {
      next[key] = current.filter(function(n) { return n !== personName; });
    } else {
      next[key] = current.concat([personName]);
    }
    schedule[1](next);
  }

  // Count shifts per person this week
  function countShifts(name) {
    var count = 0;
    for (var k in schedule[0]) {
      var list = schedule[0][k];
      for (var i = 0; i < list.length; i++) { if (list[i] === name) { count++; break; } }
    }
    return count;
  }

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Turnos y Planificacion</div>
        <div style={{ fontSize: 13, color: "#888" }}>{myLocal || "Todos los locales"} - Asigna empleados a turnos semanales</div>
      </div>

      {/* Team summary */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {myTeam.map(function(m) {
          var shifts = countShifts(m.name);
          return (
            <div key={m.id} style={{ padding: "8px 14px", borderRadius: 10, background: "#fff", border: "1px solid #eee", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: m.role === "encargado" ? "#047857" : "#1E40AF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{m.name[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{shifts} turnos</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly grid */}
      <div style={{ ...crd, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#fafaf8", borderBottom: "2px solid #f0f0f0" }}>
                <th style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#999", fontSize: 11, width: 90 }}>TURNO</th>
                {DAYS.map(function(d) {
                  return <th key={d} style={{ padding: "12px 8px", textAlign: "center", fontWeight: 600, color: "#555", fontSize: 12 }}>{d}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {SHIFTS.map(function(shift) {
                return (
                  <tr key={shift.k} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 14px", borderRight: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: shift.color }}>{shift.l}</div>
                      <div style={{ fontSize: 10, color: "#aaa" }}>{shift.time}</div>
                    </td>
                    {DAYS.map(function(day) {
                      var assigned = getAssigned(day, shift.k);
                      var isAdding = addingCell[0] === cellKey(day, shift.k);
                      return (
                        <td key={day} style={{ padding: "8px 6px", verticalAlign: "top", borderRight: "1px solid #f8f8f8", minWidth: 80 }}>
                          {assigned.map(function(name) {
                            return (
                              <div key={name} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", marginBottom: 4, borderRadius: 6, background: shift.color + "12", fontSize: 12, fontWeight: 600, color: shift.color }}>
                                <span style={{ flex: 1 }}>{name}</span>
                                <span onClick={function() { togglePerson(day, shift.k, name); }} style={{ cursor: "pointer", color: "#ccc", fontSize: 14, lineHeight: 1 }}>x</span>
                              </div>
                            );
                          })}
                          {isAdding ? (
                            <div style={{ marginTop: 2 }}>
                              {myTeam.filter(function(m) {
                                var alreadyIn = false;
                                for (var ai = 0; ai < assigned.length; ai++) { if (assigned[ai] === m.name) alreadyIn = true; }
                                return !alreadyIn;
                              }).map(function(m) {
                                return (
                                  <div key={m.id} onClick={function() { togglePerson(day, shift.k, m.name); addingCell[1](null); }} style={{ padding: "4px 8px", marginBottom: 2, borderRadius: 6, background: "#f5f5f5", cursor: "pointer", fontSize: 11, color: "#555" }}>+ {m.name}</div>
                                );
                              })}
                              <div onClick={function() { addingCell[1](null); }} style={{ padding: "3px 8px", fontSize: 10, color: "#ccc", cursor: "pointer", textAlign: "center" }}>cerrar</div>
                            </div>
                          ) : (
                            <div onClick={function() { addingCell[1](cellKey(day, shift.k)); }} style={{ padding: "4px 8px", borderRadius: 6, border: "1px dashed #e5e5e5", cursor: "pointer", fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 2 }}>+</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly tasks */}
      <div style={{ marginTop: 20, ...crd }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Tareas especiales de la semana</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Asigna tareas puntuales a empleados concretos</div>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <select value={taskForm[0].person} onChange={function(e) { taskForm[1](Object.assign({}, taskForm[0], { person: e.target.value })); }} style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff", minWidth: 120 }}>
              <option value="">Quien</option>
              {myTeam.map(function(m) { return <option key={m.id} value={m.name}>{m.name}</option>; })}
            </select>
            <select value={taskForm[0].day} onChange={function(e) { taskForm[1](Object.assign({}, taskForm[0], { day: e.target.value })); }} style={{ padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
              {DAYS.map(function(d) { return <option key={d} value={d}>{d}</option>; })}
            </select>
            <input value={taskForm[0].task} onChange={function(e) { taskForm[1](Object.assign({}, taskForm[0], { task: e.target.value })); }} placeholder="Tarea..." style={{ flex: 1, padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: 8, fontSize: 13, fontFamily: "inherit", minWidth: 150 }} />
            <button onClick={function() {
              if (!taskForm[0].person || !taskForm[0].task.trim()) return;
              wt[1](wt[0].concat([{ id: Math.random().toString(36).slice(2), person: taskForm[0].person, day: taskForm[0].day, task: taskForm[0].task.trim(), done: false }]));
              taskForm[1](Object.assign({}, taskForm[0], { task: "" }));
            }} style={{ padding: "8px 16px", background: "#B45309", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Anadir</button>
          </div>
          {wt[0].length === 0 && <div style={{ padding: 16, textAlign: "center", color: "#ccc", fontSize: 13 }}>Sin tareas especiales esta semana</div>}
          {wt[0].map(function(t) {
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderBottom: "1px solid #f5f5f5", opacity: t.done ? 0.4 : 1 }}>
                <input type="checkbox" checked={t.done} onChange={function() {
                  wt[1](wt[0].map(function(x) { return x.id === t.id ? Object.assign({}, x, { done: !x.done }) : x; }));
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, textDecoration: t.done ? "line-through" : "none" }}>{t.task}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{t.person} | {t.day}</div>
                </div>
                <button onClick={function() { wt[1](wt[0].filter(function(x) { return x.id !== t.id; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ====== ASISTENTE IA (Socio) ====== */

/* ====== OPERACIONES (Todos los roles) ====== */
function OpsView(props) {
  var ops = props.opsData;
  var d = ops[0];
  var isSocio = props.isSocio;
  var role = props.user ? props.user.role : "";
  var userName = props.user ? props.user.name : "";
  var tab = useState("comunicados");
  var expandedP = useState(null);
  var expandedA = useState(null);
  var showAddCom = useState(false);
  var comForm = useState({ title: "", content: "" });
  var showAddProto = useState(false);
  var protoForm = useState({ title: "", category: "delivery", priority: "alta", content: "" });

  var tabs = [
    { k: "comunicados", l: "Comunicados", badge: d.comunicados.filter(function(c) { return (c.readBy || []).indexOf(userName) < 0; }).length },
    { k: "protocolos", l: "Protocolos", badge: 0 },
    { k: "alertas", l: "Alertas Producto", badge: d.alertasProducto.length },
    { k: "plan", l: "Plan de Accion", badge: d.planAccion.filter(function(a) { return a.status === "pendiente"; }).length },
  ];

  var crd = { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #eee" };
  var inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };
  var btn = { padding: "8px 18px", background: "#B45309", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

  function updateOps(key, val) { var n = Object.assign({}, d); n[key] = val; ops[1](n); }

  var lvlColors = { sanitaria: "#DC2626", critico: "#D97706", vigilar: "#1E40AF", atencion: "#7C3AED" };
  var priColors = { critica: "#DC2626", alta: "#D97706", media: "#1E40AF", baja: "#888" };
  var statusColors = { "pendiente": "#D97706", "en curso": "#1E40AF", "completada": "#047857", "bloqueada": "#DC2626" };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Operaciones</div>
        <div style={{ fontSize: 13, color: "#888" }}>{isSocio ? "Publica mejoras, protocolos y comunicados para el equipo" : "Revisa protocolos, alertas y comunicados del equipo de direccion"}</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(function(t) {
          var active = tab[0] === t.k;
          return <button key={t.k} onClick={function() { tab[1](t.k); }} style={{ padding: "8px 16px", borderRadius: 10, border: active ? "2px solid #B45309" : "1px solid #e5e5e5", background: active ? "#B4530908" : "#fff", color: active ? "#B45309" : "#888", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{t.l}{t.badge > 0 ? " (" + t.badge + ")" : ""}</button>;
        })}
      </div>

      {/* COMUNICADOS */}
      {tab[0] === "comunicados" && (
        <div>
          {isSocio && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={function() { showAddCom[1](!showAddCom[0]); }} style={btn}>{showAddCom[0] ? "Cancelar" : "+ Nuevo comunicado"}</button>
              {showAddCom[0] && (
                <div style={{ ...crd, marginTop: 12, borderLeft: "4px solid #047857" }}>
                  <input value={comForm[0].title} onChange={function(e) { comForm[1](Object.assign({}, comForm[0], { title: e.target.value })); }} style={{ ...inp, marginBottom: 10 }} placeholder="Titulo del comunicado" />
                  <textarea value={comForm[0].content} onChange={function(e) { comForm[1](Object.assign({}, comForm[0], { content: e.target.value })); }} rows="4" style={{ ...inp, resize: "vertical", marginBottom: 10 }} placeholder="Contenido: que cambia, que hay que hacer diferente..." />
                  <button onClick={function() {
                    if (!comForm[0].title) return;
                    var now = new Date(); var dateStr = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
                    updateOps("comunicados", [{ id: "com" + Date.now(), title: comForm[0].title, content: comForm[0].content, author: userName, date: dateStr, readBy: [userName] }].concat(d.comunicados));
                    comForm[1]({ title: "", content: "" }); showAddCom[1](false);
                  }} style={btn}>Publicar comunicado</button>
                </div>
              )}
            </div>
          )}
          {d.comunicados.map(function(c) {
            var hasRead = (c.readBy || []).indexOf(userName) >= 0;
            return (
              <div key={c.id} style={{ ...crd, marginBottom: 10, borderLeft: "4px solid " + (hasRead ? "#047857" : "#D97706"), opacity: hasRead ? 0.85 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{c.author} | {c.date}</div>
                  </div>
                  {hasRead ? (
                    <span style={{ padding: "4px 12px", borderRadius: 8, background: "#F0FDF4", color: "#047857", fontSize: 11, fontWeight: 700 }}>Leido</span>
                  ) : (
                    <button onClick={function() { updateOps("comunicados", d.comunicados.map(function(x) { return x.id === c.id ? Object.assign({}, x, { readBy: (x.readBy || []).concat([userName]) }) : x; })); }} style={{ padding: "6px 14px", borderRadius: 8, background: "#D97706", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Marcar como leido</button>
                  )}
                  {isSocio && <button onClick={function() { updateOps("comunicados", d.comunicados.filter(function(x) { return x.id !== c.id; })); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>x</button>}
                </div>
                <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{c.content}</div>
                {isSocio && (c.readBy || []).length > 0 && <div style={{ marginTop: 8, fontSize: 11, color: "#aaa" }}>Leido por: {(c.readBy || []).join(", ")}</div>}
              </div>
            );
          })}
          {d.comunicados.length === 0 && <div style={{ ...crd, textAlign: "center", color: "#ccc", padding: 30 }}>Sin comunicados</div>}
        </div>
      )}

      {/* PROTOCOLOS */}
      {tab[0] === "protocolos" && (
        <div>
          {isSocio && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={function() { showAddProto[1](!showAddProto[0]); }} style={btn}>{showAddProto[0] ? "Cancelar" : "+ Nuevo protocolo"}</button>
              {showAddProto[0] && (
                <div style={{ ...crd, marginTop: 12, borderLeft: "4px solid #1E40AF" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <input value={protoForm[0].title} onChange={function(e) { protoForm[1](Object.assign({}, protoForm[0], { title: e.target.value })); }} style={inp} placeholder="Nombre protocolo" />
                    <select value={protoForm[0].category} onChange={function(e) { protoForm[1](Object.assign({}, protoForm[0], { category: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                      <option value="delivery">Delivery</option><option value="seguridad">Seguridad</option><option value="calidad">Calidad</option><option value="organizacion">Organizacion</option>
                    </select>
                    <select value={protoForm[0].priority} onChange={function(e) { protoForm[1](Object.assign({}, protoForm[0], { priority: e.target.value })); }} style={{ ...inp, background: "#fff" }}>
                      <option value="critica">Critica</option><option value="alta">Alta</option><option value="media">Media</option>
                    </select>
                  </div>
                  <textarea value={protoForm[0].content} onChange={function(e) { protoForm[1](Object.assign({}, protoForm[0], { content: e.target.value })); }} rows="6" style={{ ...inp, resize: "vertical", marginBottom: 10 }} placeholder="Pasos del protocolo..." />
                  <button onClick={function() {
                    if (!protoForm[0].title) return;
                    var now = new Date(); var dateStr = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
                    updateOps("protocolos", d.protocolos.concat([{ id: "pr" + Date.now(), title: protoForm[0].title, priority: protoForm[0].priority, category: protoForm[0].category, content: protoForm[0].content, active: true, date: dateStr }]));
                    protoForm[1]({ title: "", category: "delivery", priority: "alta", content: "" }); showAddProto[1](false);
                  }} style={btn}>Guardar protocolo</button>
                </div>
              )}
            </div>
          )}
          {d.protocolos.filter(function(p) { return p.active; }).map(function(p) {
            var isOpen = expandedP[0] === p.id;
            var pc = priColors[p.priority] || "#888";
            return (
              <div key={p.id} style={{ ...crd, marginBottom: 10, borderLeft: "4px solid " + pc }}>
                <div onClick={function() { expandedP[1](isOpen ? null : p.id); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{p.category} | {p.date}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 6, background: pc + "15", color: pc, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{p.priority}</span>
                  <div style={{ fontSize: 12, color: isOpen ? "#B45309" : "#ccc", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</div>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 14, padding: "14px 16px", background: "#fafaf8", borderRadius: 10, fontSize: 14, color: "#444", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {p.content}
                    {isSocio && (
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button onClick={function() { updateOps("protocolos", d.protocolos.filter(function(x) { return x.id !== p.id; })); }} style={{ padding: "6px 14px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", border: "1px solid #DC2626", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Eliminar</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ALERTAS PRODUCTO */}
      {tab[0] === "alertas" && (
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Productos que necesitan atencion especial. Revisa antes de cada turno.</div>
          {d.alertasProducto.map(function(a) {
            var isOpen = expandedA[0] === a.id;
            var lc = lvlColors[a.level] || "#888";
            return (
              <div key={a.id} style={{ ...crd, marginBottom: 10, borderLeft: "4px solid " + lc }}>
                <div onClick={function() { expandedA[1](isOpen ? null : a.id); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{a.product}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{a.local} | {a.date}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 6, background: lc + "15", color: lc, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{a.level === "sanitaria" ? "ALERTA SANITARIA" : a.level}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ padding: "12px 16px", background: "#FEF3C7", borderRadius: 10, fontSize: 13, color: "#92400E", marginBottom: 8 }}><strong>Problema:</strong> {a.notes}</div>
                    <div style={{ padding: "12px 16px", background: "#F0FDF4", borderRadius: 10, fontSize: 13, color: "#065F46" }}><strong>Que hacer:</strong> {a.actions}</div>
                    {isSocio && (
                      <div style={{ marginTop: 10 }}>
                        <button onClick={function() { updateOps("alertasProducto", d.alertasProducto.filter(function(x) { return x.id !== a.id; })); }} style={{ padding: "6px 14px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", border: "1px solid #DC2626", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Retirar alerta</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PLAN DE ACCION */}
      {tab[0] === "plan" && (
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Acciones de mejora organizadas por prioridad y plazo.</div>
          {["inmediata", "corto", "medio"].map(function(pri) {
            var items = d.planAccion.filter(function(a) { return a.priority === pri; });
            if (items.length === 0) return null;
            var priLabels = { inmediata: "ACCIONES INMEDIATAS (esta semana)", corto: "CORTO PLAZO (2-4 semanas)", medio: "MEDIO PLAZO (1-3 meses)" };
            var priC = { inmediata: "#DC2626", corto: "#D97706", medio: "#1E40AF" };
            return (
              <div key={pri} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: priC[pri], letterSpacing: 0.5, marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid " + priC[pri] + "30" }}>{priLabels[pri]}</div>
                {items.map(function(a) {
                  var sc = statusColors[a.status] || "#888";
                  return (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", borderRadius: 10, border: "1px solid #eee", marginBottom: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 5, background: sc, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{a.action}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{a.responsible} | {a.deadline}</div>
                      </div>
                      {isSocio ? (
                        <select value={a.status} onChange={function(e) { updateOps("planAccion", d.planAccion.map(function(x) { return x.id === a.id ? Object.assign({}, x, { status: e.target.value }) : x; })); }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e5e5", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: "#fff", color: sc }}>
                          <option value="pendiente">Pendiente</option>
                          <option value="en curso">En curso</option>
                          <option value="completada">Completada</option>
                          <option value="bloqueada">Bloqueada</option>
                        </select>
                      ) : (
                        <span style={{ padding: "3px 10px", borderRadius: 6, background: sc + "15", color: sc, fontSize: 11, fontWeight: 700 }}>{a.status}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
