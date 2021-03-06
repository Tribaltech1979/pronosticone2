var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer =   require('multer');
var upload      =  multer({ dest: './public/img/team/',
rename: function (fieldname, filename) {
    return filename+Date.now();
},
onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
},
onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
}
});


var my_ute = require('./utente.js');
var my_tor = require('./torneo.js');
var my_par = require('./partita.js');

var dbw = require("./dbworker.js");

var usrlog = require("./usrlog.js");


/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.utente){
        res.redirect('/utente');
    }
    else {res.render('index', { title: 'Pronosticone' });}
});
//// LOGIN
router.get('/login', function(req,res){
    if(req.session.utente){
        res.redirect('/utente');
    }
    else {res.render('login');}
});
///// CAMBIO PASSWORD
router.get('/cambiop',function(req,res){
	if(req.session.utente){
			res.render('cambiopass');
		}
	else{res.redirect('/login');}

});
///////////////
/// CAMBIO PASSWORD
///////////////////

router.post('/cambiop',function(req,res){
		var passo = req.body.passold;
		var passn = req.body.passnew;
		var pool = req.pool;
		
		    var usrquery =  "select UTE_COD_UTENTE from Utenti where UTE_COD_UTENTE = " + req.session.utente + " and UTE_PASS = '" + passo+"'" ;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(usrquery,function(err,rows){
            connection.release();
            if(!err) {
								var updquery = "UPDATE Utenti set UTE_PASS = '"+passn+"' where UTE_COD_UTENTE = "+req.session.utente+" ;";
								pool.getConnection(function(err,connection){
					            if (err) {
					                connection.release();
					                res.json({"code" : 100, "status" : "Error in connection database"});
					                return;
					            }
					
					            console.log('connected as id ' + connection.threadId);
					
					            connection.query(updquery,function(err,rows){
					                connection.release();
					                if(!err) {
															res.sendStatus(200);
					                }
					                else{
					                		res.sendStatus(500);
					                	}
					            });
					
					            connection.on('error', function(err) {
					                res.json({"code" : 100, "status" : "Error in connection database"});
					
					            });
					        });
            }
            else{
                res.sendStatus(400);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });
		
		
	});
//////////////////
//// CAMBIO NOME SQUADRA
/////////////////

router.post('/cambiosq', function(req,res){
    var pool = req.pool;
    var nomesq = req.body.sqnew;

    if(req.session.id_squadra)
    {
        var upd_sq = "UPDATE Squadre set SQ_NOME_SQUADRA = '"+nomesq+"' where SQ_ID_SQUADRA = "+req.session.id_squadra;
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(upd_sq,function(err,rows){
                connection.release();
                if(!err) {
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(500);
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login');
    }
});

///////////////
//// MAIL
//////////////

router.post('/cmail', function(req,res){
    var pool = req.pool;
    var nmail = req.body.smail;
    var avv = req.body.avv;

    if(req.session.id_squadra)
    {
        var upd_sq = "UPDATE Squadre set SQ_MAIL = '"+nmail+"', SQ_AVVISO = '"+avv+"' where SQ_ID_SQUADRA = "+req.session.id_squadra;
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(upd_sq,function(err,rows){
                connection.release();
                if(!err) {
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(500);
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login');
    }
});


//////////////////////
///// POST LOGIN
///////////////////////
router.post('/login',function(req,res){
    var pool = req.pool;
    var username = req.body.username;
    var password = req.body.password;



    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

       // console.log('connected as id ' + connection.threadId);
        var usrquery =  "select UTE_COD_UTENTE from Utenti where UTE_MAIL = " + connection.escape(username) + " and UTE_PASS = " +connection.escape(password)+" ;";
        
       // console.log("usrQuery : "+usrquery);
        
        connection.query(usrquery,function(err,rows){
            connection.release();
            if(!err) {
                if(rows[0]) {
                    //console.log(rows[0]);
                    var ulog = new usrlog(pool,rows[0].UTE_COD_UTENTE,"LOGIN","OLD");
                    req.session.utente = rows[0].UTE_COD_UTENTE;
                    req.session.id_squadra = rows[0].UTE_COD_UTENTE;
                    /*
                     var chk_torneo = "SELECT count(cod_torneo) as conto from v_torneo where cod_utente = " + req.session.utente +" AND arch <> 'X'";
                     connection.query(chk_torneo, function(err, ris){
                            if(ris.conto == 0)
                            {
                                res.redirect('/gettorn');
                            }
                            else  { //vai ad utente
                     } );

                     */
                    res.redirect('/utente');
                }
                else{
                    console.log(err);
                    res.redirect('/login');
                }
            }
            else{
                res.redirect('/login');
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });



});
//////////////////////
///// POST LOGIN FACEBOOK
////  Creo UTE_FB_ID
///////////////////////
router.get('/fblogin*',function (req,res) {
    var pool = req.pool;
    var profilo = req.user;

    req.session.fbprofilo = profilo ;

    var username = profilo.id;


    var usrquery =  "select * from Utenti where UTE_FB_ID = " + username  ;


    pool.getConnection(function(err,connection){
        connection.query(usrquery,function(err, usr){


            if (!usr.length){

                var insquery = "INSERT INTO Utenti set UTE_FB_ID = "+ username ;

                connection.query(insquery, function (err,ris1) {
                    if(!err){
                        connection.query(usrquery,function(err, usr2){
                            connection.release();
                            req.session.id_squadra = usr2[0].UTE_COD_UTENTE;
                            req.session.id = usr2[0].UTE_COD_UTENTE;
                            var ulog = new usrlog(pool,req.session.utente,"NEW USER","FACEBOOK");
                            res.redirect('/getsquadra');

                        });
                    }
                    else{
                        connection.release();
                    }
                });


                }else if(usr[0].UTE_ID_SQUADRA > 0) {
                //// ha la squadra, verifico il torneo
                req.session.id = usr[0].UTE_COD_UTENTE;
                req.session.id_squadra = usr[0].UTE_ID_SQUADRA;
                req.session.utente = usr[0].UTE_ID_SQUADRA;
                var chk_torneo = "SELECT count(cod_torneo) as conto from v_torneo where cod_squadra= " + req.session.id_squadra +" AND archiviato is null";
                connection.query(chk_torneo,function(err,chk1){
                    connection.release();
                    if(chk1[0].conto > 0)
                    {
                        var ulog = new usrlog(pool,req.session.utente,"LOGIN","FACEBOOK");
                        res.redirect('/utente');
                    }
                    else{
                        var ulog = new usrlog(pool,req.session.utente,"LOGIN","FACEBOOK-2");
                        res.redirect('/newtorneo');
                    }
                });




            }else {
                connection.release();
                /// non ha la squadra
                req.session.id_squadra = usr[0].UTE_COD_UTENTE;
                var ulog = new usrlog(pool,req.session.utente,"LOGIN","FACEBOOK-3");
                res.redirect('/getsquadra');

            }


        });



    });


});
///////////////////
//// nuova squadra
///////////////////
router.get('/getsquadra',function(req,res){

   var sq_name = req.user.displayName;
  //  console.log(req.user);
    var image = "http://graph.facebook.com/"+req.user.id+"/image";
    res.render('newsq', {
        "nome_sq": sq_name,
        "sq_image": image,
        "sq_mail": req.user.email
    });

});
////////
/// SIGN IN
/////////

router.get('/fbsignin',function(req,res){

    var sq_name = req.session.profilo.name + " " +req.session.profilo.last_name;
    var image = "http://graph.facebook.com/"+req.session.profilo.id+"/image";
    res.render('signin', {
        "nome_sq": sq_name,
        "sq_image": image,
        "sq_mail": req_session.profilo.email
    });

});

router.get('/signin',function(req,res){
    res.render('signin',{
        title : "Registrati"
    });
});
///////////////////////
//////
////////////////////////
router.post('/checkuser',function(req,res){

    var user = req.body.username;
    var pool = req.pool;
   // console.log(pool);
    //console.log(user);


    pool.getConnection(function(err,connection){
       // console.log(connection.threadId);
        
        var checkuser = "Select * from Utenti where UTE_MAIL = "+ connection.escape(user)+" ;" ;
        //console.log(checkuser);
        connection.query(checkuser, function(req,ris) {
            connection.release();
            console.log(ris.length);
            if( ris.length > 0){
                res.status(310).send({stato :'fail'});
            }
            else{
                res.send({stato : 'success'});
            }
        });
    });
});

///////////////////////
//////
////////////////////////
router.post('/checkmail',function(req,res){

    var user = req.body.email;
    var pool = req.pool;

    pool.getConnection(function(err,connection){
        
        var checkuser = "Select * from Squadre where SQ_MAIL = "+connection.escape(user)+" ;";
        connection.query(checkuser, function(req,ris) {
            connection.release();
            if(ris.length == 0){
                res.json({stato :'success'});
            }
            else{
                res.json({stato :'fail'});
            }
        });
    });
});

//////////////////
////// ins nuova squadra
/////////////////
router.post('/newsq',function(req,res){
    var pool =  req.pool;
    var sq_name = req.body.squadra;
    var image = req.body.image;
    var email = req.body.email;
    var check = req.body.chk;

    var id_squadra = req.session.id_squadra;
    req.session.utente = id_squadra;
    
    console.log("id_squadra : "+id_squadra);
    console.log("id :"+ req.session.id);

    if (id_squadra){



        pool.getConnection(function(err, connection){

            var ins_squ = "Insert into Squadre values ( "+id_squadra+", "+connection.escape(sq_name)+", "+connection.escape(email)+", "+ connection.escape(image) +", "+connection.escape(check)+", sysdate());";
            connection.query(ins_squ, function(err,ris_ins){
                if(!err){
                    var upd_ute = "Update Utenti set UTE_ID_SQUADRA = "+id_squadra+" WHERE UTE_COD_UTENTE = "+id_squadra;
                    connection.query(upd_ute, function (err, ris_upd) {
                       if(!err){
                           connection.release();
                           req.session.id = id_squadra;
                           req.session.id_squadra = id_squadra;
                           
                           res.redirect('/newtorneo');
                           //res.redirect('');
                       }
                        else{
                           var del_sq = "Delete from Squadre Where SQ_ID_SQUADRA = " +id_squadra;
                           connection.query(del_sq,function(err,ris){
                               connection.release();
                               res.redirect('/getsquadra');
                           })
                       }
                    });
                }
                else{
                    connection.release();
                    res.redirect('/getsquadra');
                }

            });

        });
    }
    else{
        res.status(500);
    }


});
//////////////
/// SIGNIN
/////////////////
router.post('/signin',function(req,res){
    var pool =  req.pool;
    var sq_name = req.body.squadra;
    var image = req.body.image;
    var email = req.body.email;
    var check = req.body.chk;
    var username = req.body.squadra;
    var password = req.body.password;

    console.log(username);
        

       
   
   
    
    pool.getConnection(function(err,connection){
        
        var check_query = "Select * from Utenti where UTE_MAIL = "+connection.escape(username)+" ;";
        var check_mail = "Select * from Squadre where SQ_MAIL = "+connection.escape(email)+" ;";
        
         connection.query(check_query,function(err, risp){
            if(risp.length > 0){
                connection.release();
                res.redirect("/");
            }
            else{
                connection.query(check_mail,function(err, risp2){
                    
                    if(risp2.length > 0){
                        connection.release()
                        res.redirect("/");
                    }
                    else{

        var insquery = "INSERT Utenti (UTE_MAIL, UTE_PASS, UTE_ID_SQUADRA, UTE_FB_ID, UTE_GP_ID ) values ( "+connection.escape(username)+" , "+connection.escape(password)+" , null , null , null ) ;";
        
        //console.log(insquery);
        
        //console.log(insquery);
            
            connection.query(insquery,function(err,ris1){
                if(!err){
                    
                    //console.log(req.session.utente);
                    var id_squadra = ris1.insertId;
                    var ulog = new usrlog(pool,id_squadra,"NEW USER","REGISTRATI");
                    var ins_squ = "Insert Squadre values ( "+id_squadra+", "+connection.escape(sq_name)+", "+connection.escape(email)+", "+connection.escape(image)+", "+connection.escape(check)+", sysdate());";
                    connection.query(ins_squ,function(err,ris_ins){
                        if(!err){
                            var upd_ute = "Update Utenti set UTE_ID_SQUADRA = "+id_squadra+" WHERE UTE_COD_UTENTE = "+id_squadra;
                            connection.query(upd_ute,function(err,ris_upd){
                                if(!err){
                                    connection.release();
                                    console.log("changed rows : " + ris_upd.changedRows);
                                    
                                    req.session.utente= id_squadra;
                                    res.redirect('/newtorneo');
                                }
                                else{
                                    connection.release();
                                    var ulog = new usrlog(pool,0,"NEW USER 2",err.code);
                                    
                                    res.redirect('/');
                                }
                               
                            });
                        }
                        else{
                            var ulog = new usrlog(pool,0,"NEW USER 1",err.code);
                            
                             res.redirect('/');
                        }
                    });
                   
                    
                }
                else{
                    var ulog = new usrlog(pool,0,"NEW USER",err.code);
                    
                }
               
            });
                    }
                                 });
            }
        });
    })
    


});



////////////////
//// iscrizione torneo
/////////////////////
router.get('/newtorneo',function(req,res){
    var pool = req.pool;
    var id_squadra = req.session.utente ;

    if (req.session.utente){
    var new_tor = "select * from Torneo where TOR_ARC is null and convert_tz(sysdate(),'-1:00','+1:00') < TOR_DATA_LIM and TOR_COD_TORNEO NOT IN ( select cod_torneo from v_torneo where cod_squadra = "+id_squadra+" )";
    }
    else{
        res.redirect('/utente');
    }
    console.log(new_tor);

    pool.getConnection(function(err,connection){
        
        connection.query(new_tor,function(err,ris){
            connection.release();
            if(!ris.length) {
                      res.redirect('/utente');

            }else{
                //console.log(ris);
                res.render('newtor',{
                    "title" : "Aggiungi Torneo",
                    "torneo" : ris
                });

              
            }
        });
    });



});

router.get('/addtorneo',function(req,res){
    var pool = req.pool;
    var id = req.session.utente;

   var new_tor = "select * from Torneo where TOR_ARC is null and convert_tz(sysdate(),'-1:00','+1:00') < TOR_DATA_LIM and TOR_COD_TORNEO NOT IN ( select cod_torneo from v_torneo where cod_squadra = "+id+" )";

    pool.getConnection(function(err,connection){
        connection.query(new_tor,function(err,ris){
            
            if( Array.isArray(ris)) {
                var tmquery = "select * from v_torneo where cod_squadra = "+id+" order by cod_torneo desc";
                connection.query(tmquery,function(err, ris2){
                    
                    connection.release();
                    res.render('addtor',{
                        "title" : "Aggiungi Torneo",
                        "torneo" : ris,
                        "torneo2" :ris2

                    });

                });//tmquery


            }else{
                connection.release();
                res.redirect('/utente');
            }
        });
    });



});
router.get('/addtor*',function(req,res){
    var pool = req.pool;
    var id = req.session.utente;
    var tid = req.query.tid;

    pool.getConnection(function(err,connection){
        connection.beginTransaction(function(err){
            if(!err){
                var q_tor = "select * from Torneo where TOR_COD_TORNEO = "+ connection.escape(tid);
                console.log("qtor "+q_tor );
                connection.query(q_tor,function(err,ris1){
                    if(Array.isArray(ris1)){
                        if(ris1[0].TOR_TIPO_TORNEO == 4){
                            var Partquery = "Insert into Partecipanti SET PAR_COD_TORNEO = "+ris1[0].TOR_COD_TORNEO+", PAR_COD_SQUADRA = "+id;
                            
                            console.log("Part q : "+ Partquery);
                            
                            connection.query(Partquery,function(err, risq){
                               if(!err){
                                    /// GENERO PRONOSTICO
                                   var genPron = "insert into Pronostico (select PP_COD_TORNEO,PP_COD_PARTITA, PAR_COD_SQUADRA ,null,null,null,null,null,null,null,null,null,null,null,null,null from Partite_Pronostico , Partecipanti where PP_COD_TORNEO = PAR_COD_TORNEO and pp_cod_torneo = "+ris1[0].TOR_COD_TORNEO+" and pp_nro_giornata in ( Select GIO_NRO_GIORNATA FROM Giornate where GIO_COD_TORNEO = "+ris1[0].TOR_COD_TORNEO+" ) and PAR_COD_SQUADRA = "+id+") ;";
                                   /// GENERO CALENDARIO
                                   var genCal = "insert into Calendario ( SELECT GIO_COD_TORNEO, GIO_NRO_GIORNATA, "+id+", "+ id+",0,null,null,null,null,null,null,null from Giornate where GIO_COD_TORNEO = " +ris1[0].TOR_COD_TORNEO+" ) ;";
                                   /// GENERO PRONOSTICO_EX
                                   var genPX = "INSERT into Pronostico_ex (SELECT GIO_COD_TORNEO, "+id+", PP_COD_PARTITA, null , null from Giornate, Partite_Pronostico where GIO_COD_TORNEO = PP_COD_TORNEO and GIO_NRO_GIORNATA = PP_NRO_GIORNATA and GIO_TIPO > 1) ;";
                                   
                                   genPron = genPron + genCal + genPX;
                                   
                                   console.log("GEN : " + genPron );
                                   
                                   connection.query(genPron,function(err,pronq){
                                       if(!err){
                                           connection.commit();
                                           res.redirect('/utente');
                                       }
                                       else{
                                           connection.rollback();
                                       }
                                   });
                               }
                                else{
                                    connection.rollback();
                                }
                            });
                           
                        }
                    }
                    else{
                        connection.rollback();
                    }
                });
            }
            else{
                connection.rollback();
            }
            
        });
       
});
});
/////////
//// CHAT
/////
router.get('/getchat/:tid', function(req,res){
    var pool= req.pool;
    var tid = req.params.tid;
    
    var chat_q = "Select * from Chat where TID = "+tid+" LIMIT 20";
    
    pool.getConnection(function(err, connection){
        connection.query(chat_q, function(err, rows){
            connection.release();
            
            res.json(rows);
        }) ;
    });
    
});




///////////////////
//// CAMBIO IMAGE
///////////////////
router.get('/cimg', function(req,res){
    var pool = req.pool;
    if(req.session.id_squadra) {
        var sq_query = 'select * from Squadre where SQ_ID_SQUADRA = '+req.session.id_squadra;
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                res.json({"code": 100, "status": "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(sq_query, function (err, rows) {
                connection.release();
                if (!err) {
                    res.render('cimg', {
                        "user": rows[0]
                    });
                }
            });

            connection.on('error', function (err) {
                res.json({"code": 100, "status": "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login');
    }
});
///////////////////
//// LOGOFF
/////////////////
router.get('/logoff', function(req,res){
	delete req.session.utente;
	delete req.session.id_squadra;
    delete req.session.profilo;
	res.redirect('/');
	});

////////////////////
///// TORNEO
///////////////////
router.get('/torneo*', function(req, res){


if(req.query.tid){    
    if (req.session.id_squadra) {
        console.log("torn 1");
        var sess_tor = new my_tor(res, req.pool,req.query.tid,req.session.id_squadra, req.session.utente);
        sess_tor.init();
        sess_tor.render();

    }
    else if( req.query.tid == 16){
        console.log("torn 2");
        var sess_tor = new my_tor(res, req.pool,req.query.tid,req.session.id_squadra, 0);
        sess_tor.init();
        sess_tor.render();
    }
    else{
         console.log("torn 3");
        res.redirect('/');
    }
}
    else{res.redirect(back);}

});

router.get('/vistorneo*',function(req, res){
    var pool = req.pool;
    var ntid = req.query.tid;
    var nuser = req.query.us;

    pool.getConnection(function(err, connection){

        var vis_torn_q = "select GIO_COD_TORNEO 'cod_torneo', GIO_NRO_GIORNATA 'nro_giornata' , "+connection.escape(nuser)+" as 'nro_partita' , GIO_ETICHETTA 'etichetta' from Giornate where GIO_COD_TORNEO = "+connection.escape(ntid);

        console.log(vis_torn_q);
        connection.query(vis_torn_q, function(err, risultato){

            if(!risultato.length){
                connection.release();
                res.redirect(back);
            }
            else {
                var nsq = "select SQ_NOME_SQUADRA from Squadre where SQ_ID_SQUADRA = "+connection.escape(nuser);
                connection.query(nsq, function (err, risul ) {
                   if(!risul.length){
                       connection.release();
                       res.redirect(back);
                   }
                    else{
                       connection.release();
                       res.render('vis_torneo',{
                          "title": "Visualizza pronostico di "+ risul[0].SQ_NOME_SQUADRA,
                          "uname" : risul[0].SQ_NOME_SQUADRA,
                          "pclass" : risultato
                       });
                   }

                });
            }

        });


    });


});

router.get('/gettorneo/:tid', function(req, res){
    var pool = req.pool;
    var mtid = req.params.tid;

    var class_query = 'select nome_squadra as Squadra, giocate as Giocate, punti as Punti, vinte as Vinte, pareggiate as Pareggiate, perse as Perse, gol_fatti as Fatti, gol_subiti as Subiti from classifica where cod_torneo = ' + mtid ;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(class_query,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });
});
////////////////////
//// PARTITA
/////////////////////

router.get('/partita*', function(req, res){
    var pool = req.pool;
    var tid = req.query.tid;
    var ngio = req.query.ngio;
    var npar = req.query.npar;



    if (req.session.utente){
            var sess_par = new my_par(res, pool, tid, ngio, npar,req.session.utente,req.session.utente);
        sess_par.init();
        sess_par.render();
    }
    else if (req.query.tid == 16)
        {
        var sess_par = new my_par(res, pool, tid, ngio, npar,0,0);
        sess_par.init();
        sess_par.render();
        }
    else{
        res.redirect('/login');
    }



});

router.get('/stati*', function(req,res){
   var pool = req.pool;
   var tid = req.query.tid;
    
var  stat_q = "select * from v_stat_segno where cod_torneo = "+tid+" and data IN ( date(sysdate()), date(sysdate())+1, date(sysdate())+2, date(sysdate())+3) order by data asc, cod_partita asc, perc desc";
    var db_stat_q = new dbw(pool, stat_q);
    
    db_stat_q.getResult(function(stat){
        res.render('stati',{
            "statis1" : stat,
            "statis2" : stat,
            "id_squadra" : req.session.id_squadra,
            "tid" : tid
        })
    });
    
    
});




//////////////////
//// POST SALVA PRONOSTICO
////////////////
router.post('/salvapron',function(req, res){
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
    var t3 = JSON.parse(req.body.tab3);
    var t4 = JSON.parse(req.body.tab4);
    var t5 = JSON.parse(req.body.tab5);
    var t6 = JSON.parse(req.body.tab6);
    var t7 = JSON.parse(req.body.tab7);
    var t8 = JSON.parse(req.body.tab8);
    var t9 = JSON.parse(req.body.tab9);
    var t10 = JSON.parse(req.body.tab10);
    var t11 = JSON.parse(req.body.tab11);
    var q_pp = "SELECT * FROM Partite_Pronostico  WHERE PP_COD_TORNEO = " + tid + " AND PP_NRO_GIORNATA = "+ngio;

   // console.log(t10);

    if (req.session.id_squadra){
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(q_pp,function(err,rows){
                connection.release();
                if(!err) {
                    var upd_q = '';
                    var index;
                    for (index = 0; index < rows.length; index++){
                        var part = rows[index].PP_COD_PARTITA;
                        var q_up = "UPDATE Pronostico SET PRO_GOL_HOME = "+ t1[part]+ ", PRO_GOL_AWAY = "+ t2[part]+", PRO_GOL_HOME2 = "+ t3[part];
                        var q_up2 = ", PRO_GOL_AWAY2 = "+t4[part]+", PRO_GOL_J = "+t5[part]+", PRO_SEGNO = "+t9[part]+", PRO_SEGNO2 = "+t10[part]+", PRO_SEGNOJ = "+t11[part]+", PRO_NRO_GOL = "+t6[part]+", PRO_NRO_GOL2 = "+t7[part]+", PRO_NRO_GOL_J = " +t8[part]+" , PRO_SAVE = 'X', PRO_SAVE_DATA = NOW()";
                        var wh = " WHERE PRO_COD_TORNEO = " + tid + " AND PRO_COD_PARTITA = "+part +" AND PRO_COD_UTENTE = "+  req.session.id_squadra;
                        var upd = q_up + q_up2+ wh;
                        upd_q = upd_q + upd + ";"
                    }
                   // console.log(upd_q);
                    pool.getConnection(function(err,connection){
                        if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                        }
                        connection.query(upd_q,function(err2) {
                            connection.release();
                            if (!err2) {
                                res.send('OK');
                            }
                        });
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }




});
//////////////////
//// POST SALVA PRONOSTICO 2
////////////////
router.post('/salvapron2',function(req, res){
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
 //   var t3 = JSON.parse(req.body.tab3);
    //var t4 = JSON.parse(req.body.tab4);
//    var t5 = JSON.parse(req.body.tab5);
    var t6 = JSON.parse(req.body.tab6);
  //  var t7 = JSON.parse(req.body.tab7);
    //var t8 = JSON.parse(req.body.tab8);
    var t9 = JSON.parse(req.body.tab9);
    //var t10 = JSON.parse(req.body.tab10);
    //var t11 = JSON.parse(req.body.tab11);
    var q_pp = "SELECT * FROM Partite_Pronostico  WHERE PP_COD_TORNEO = " + tid + " AND PP_NRO_GIORNATA = "+ngio;
    

    //console.log(t9);
    console.log(req.session.id_squadra);

    if (req.session.id_squadra){
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(q_pp,function(err,rows){
                connection.release();
                if(!err) {
                    var upd_q = '';
                    var index;
                    for (index = 0; index < rows.length; index++){
                        var part = rows[index].PP_COD_PARTITA;
                        var q_up = "UPDATE Pronostico SET PRO_GOL_HOME = "+ t1[part]+ ", PRO_GOL_AWAY = "+ t2[part]+", PRO_SEGNO = "+t9[part]+", PRO_NRO_GOL = "+t6[part]+" , PRO_SAVE = 'X', PRO_DATA_SAVE = SYSDATE()";
                        var wh = " WHERE PRO_COD_TORNEO = " + tid + " AND PRO_COD_PARTITA = "+part +" AND PRO_COD_UTENTE = "+  req.session.id_squadra;
                        var upd = q_up + wh;
                        upd_q = upd_q + upd + ";"
                    }
                    
                   console.log(upd_q);
                    pool.getConnection(function(err,connection){
                        if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                        }
                        connection.query(upd_q,function(err2) {
                            connection.release();
                            if (!err2) {
                                res.send('OK');
                            }
                        });
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }




});
//////////////////
//// POST SALVA PRONOSTICO 3
//// ladder con scelta multipla
////////////////
router.post('/salvapron3',function(req, res){
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
 //   var t3 = JSON.parse(req.body.tab3);
    //var t4 = JSON.parse(req.body.tab4);
//    var t5 = JSON.parse(req.body.tab5);
    var t6 = JSON.parse(req.body.tab6);
  //  var t7 = JSON.parse(req.body.tab7);
    //var t8 = JSON.parse(req.body.tab8);
    var t9 = JSON.parse(req.body.tab9);
    //var t10 = JSON.parse(req.body.tab10);
    //var t11 = JSON.parse(req.body.tab11);
    var t12 = JSON.parse(req.body.tab12); //casa
    var t13 = JSON.parse(req.body.tab13);// away
    var q_pp = "SELECT * FROM Partite_Pronostico  WHERE PP_COD_TORNEO = " + tid + " AND PP_NRO_GIORNATA = "+ngio;

   // console.log(t10);

    if (req.session.id_squadra){
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(q_pp,function(err,rows){
                connection.release();
                if(!err) {
                    var upd_q = '';
                    var index;
                    for (index = 0; index < rows.length; index++){
                        var part = rows[index].PP_COD_PARTITA;
                        var q_up = "UPDATE Pronostico SET PRO_GOL_HOME = "+ t1[part]+ ", PRO_GOL_AWAY = "+ t2[part]+", PRO_SEGNO = "+t9[part]+", PRO_NRO_GOL = "+t6[part]+" , PRO_SAVE = 'X', PRO_DATA_SAVE = NOW()";
                        var wh = " WHERE PRO_COD_TORNEO = " + tid + " AND PRO_COD_PARTITA = "+part +" AND PRO_COD_UTENTE = "+  req.session.id_squadra;
                        var upd = q_up + wh;
                        upd_q = upd_q + upd + ";"
                        var insq = "UPDATE Pronostico_ex SET PX_RIS_HOME ='"+t12[part]+"', PX_RIS_AWAY = '"+t13[part]+"' WHERE PX_TID = "+tid+" AND PX_UTE = "+req.session.id_squadra+" AND PX_PAR = "+part+" ;";
                        upd_q = upd_q + insq;
                    }
                    //console.log(upd_q);
                    pool.getConnection(function(err,connection){
                        if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                        }
                        connection.query(upd_q,function(err2) {
                            connection.release();
                            if (!err2) {
                                res.send('OK');
                            }
                        });
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }




});

///////////
//// SALVAPRON 4 VINCITORE SECCO
////////////
router.post('/salvapron4',function(req,res){
    //////////////////
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
  //  var t1 = JSON.parse(req.body.tab1);
//    var t2 = JSON.parse(req.body.tab2);
 //   var t3 = JSON.parse(req.body.tab3);
    //var t4 = JSON.parse(req.body.tab4);
//    var t5 = JSON.parse(req.body.tab5);
  //  var t6 = JSON.parse(req.body.tab6);
  //  var t7 = JSON.parse(req.body.tab7);
    //var t8 = JSON.parse(req.body.tab8);
    //var t9 = JSON.parse(req.body.tab9);
    //var t10 = JSON.parse(req.body.tab10);
    //var t11 = JSON.parse(req.body.tab11);
    var t12 = JSON.parse(req.body.tab12); //casa
    //var t13 = JSON.parse(req.body.tab13);// away
    var q_pp = "SELECT * FROM Partite_Pronostico  WHERE PP_COD_TORNEO = " + tid + " AND PP_NRO_GIORNATA = "+ngio;

   // console.log(t10);

    if (req.session.id_squadra){
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

          // console.log('connected as id ' + connection.threadId);

            connection.query(q_pp,function(err,rows){
                //console.log(rows.length);
                connection.release();
                if(!err) {
                    var upd_q = '';
                    var index;
                    for (index = 0; index < rows.length; index++){
                        
                        var part = rows[index].PP_COD_PARTITA;
                        //console.log(part);
                        var q_up = "UPDATE Pronostico SET PRO_SAVE = 'X', PRO_DATA_SAVE = NOW()";
                        var wh = " WHERE PRO_COD_TORNEO = " + tid + " AND PRO_COD_PARTITA = "+part +" AND PRO_COD_UTENTE = "+  req.session.id_squadra;
                        var upd = q_up + wh;
                        upd_q = upd_q + upd + ";"
                        var insq = "UPDATE Pronostico_ex SET PX_RIS_HOME ='"+t12[part]+"'WHERE PX_TID = "+tid+" AND PX_UTE = "+req.session.id_squadra+" AND PX_PAR = "+part+" ;";
                        upd_q = upd_q + insq;
                    }
                    
                    
                    pool.getConnection(function(err,connection){
                        if (err) {
                            connection.release();
                            res.json({"code" : 100, "status" : "Error in connection database"});
                            return;
                        }
                        connection.query(upd_q,function(err2) {
                            connection.release();
                            if (!err2) {
                                res.send('OK');
                            }
                        });
                    });
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    
    }
});
/////////
router.get('/ristorneo*', function(req, res, next) {
    var pool = req.pool;
    var tid = req.query.tid;



    if(req.session.utente){
        var check1 = "select * from Torneo where TOR_COD_TORNEO = "+tid+" AND TOR_COD_MASTER = "+req.session.utente;
        var gior = "select * from v_insris where cod_torneo = "+tid+" and nro_giornata = (select min(nro_giornata) from v_insris where cod_torneo = "+tid +" and g_home is null)";
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                res.json({"code" : 100, "status" : "Error in connection database"});
                return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query(check1,function(err,rows){

                if(!err) {
                    

                    
                    if (rows[0].TOR_TIPO_TORNEO != 4){
                        
                        connection.query(gior,function(err2,rows2) {

                        connection.release();
                        if(!err2) {
                            res.render('insertris', {
                                "list": rows2,
                                "descr": rows[0].TOR_DESCR_TORNEO
                            });
                        }
                    });
                    }
                    else{
                        var gior4 = "select * from v_insris where cod_torneo = "+tid+" and g_home is null ;";
                        
                        connection.query(gior4,function(err3, row3){
                           connection.release();
                            if(!row3.length){
                                res.redirect(back);
                            }
                            else{
                                res.render('insertris',{
                                   "list":row3,
                                    "descr": rows[0].TOR_DESCR_TORNEO
                                });
                            }
                        });
                    }


                }
                else{
                    connection.release();
                }
            });

            connection.on('error', function(err) {
                res.json({"code" : 100, "status" : "Error in connection database"});

            });
        });
    }
    else{
        res.redirect('/login')
    }


});

router.post('/salvaris',function(req,res){
    var pool = req.pool;
    var t1 = JSON.parse(req.body.tab1);
    var t2 = JSON.parse(req.body.tab2);
    var t3 = JSON.parse(req.body.tab3);
    var t4 = {};
     t4 = JSON.parse(req.body.tab4);
    
    var arr= Object.keys(t4).map(function(k){return t4[k]});
    
   // console.log(t1);
   // console.log(t2);
    //console.log(t3);
    console.log(arr.length);

    var uquery = '';
    var count;
    for(count = 0; count < arr.length; count++){
        var part = t4[count];
        var upd = 'UPDATE Partite set PAR_GOL_HOME = '+t1[part]+' , PAR_GOL_AWAY = '+t2[part]+' , PAR_SEGNO = '+t3[part]+' WHERE PAR_COD_PARTITA = '+part+' ;';

        uquery = uquery + upd;
         console.log(uquery);
    }
    
   

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(uquery,function(err,rows){
            connection.release();
            if(!err) {
                res.send('OK');
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });

});
//////////////////////////
////////// GESTIONE SQUADRA
//////////////////////////
router.get('/gestsq',function(req,res){
    var pool = req.pool;
if(req.session.id_squadra) {
    var sq_query = 'select * from Squadre where SQ_ID_SQUADRA = '+req.session.id_squadra;
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(sq_query, function (err, rows) {
            connection.release();
            if (!err) {
                res.render('gestsq', {
                    "user": rows[0]
                });
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});

        });
    });
}
    else{
    res.redirect('/login');
}

});
///////////////////////////////////
///// Real Time
///////////////////////////////////
router.get('/rt*',function(req,res){
    var pool = req.pool;
    var tid = req.query.tid;
    var check1 = "SELECT * FROM v_punti2 WHERE cod_torneo = "+tid+" AND nro_giornata = ( SELECT min(CAL_NRO_GIORNATA) from Calendario where CAL_COD_TORNEO = "+ tid+" AND CAL_PUNTI_HOME is null ) ";
    ////estrarre totale partite caricate, totale partite e %partite
    var check2 = "select count(*) partot, sum( if (g_home is not null, 1,0) ) pargio, round(( sum( if (g_home is not null, 1,0) )/count(*))*100) valuenow from v_insris";
    check2 = check2 + " where cod_torneo = "+tid+" and nro_giornata = ( SELECT min(CAL_NRO_GIORNATA) from Calendario where CAL_COD_TORNEO = cod_torneo AND CAL_PUNTI_HOME is null )";

    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        connection.query(check1,function(err,rows){
            if(!err) {
                connection.query(check2,function(err,rows2){

                    connection.release();
                    if(!err){
                        res.render('rt',{
                            "pargio" : rows2[0].pargio,
                            "partot" : rows2[0].partot,
                            "valuenow" : rows2[0].valuenow,
                            "cod_torneo" : tid,
                            "list" : rows
                        });
                    }
                });

            }
        });


        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });

    });
});


/////////////////////////////////////
/////// FOTO
////////////////////////////////////

router.post('/photo', upload.single('userPhoto') ,function(req,res){
    console.log("foto - path : "+ req.file.path+" name : "+req.file.name);
    var pool = req.pool;
    var tmp_path = req.file.path;

    var target_path = './public/img/team/' + req.file.originalname;

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
            fs.unlinkSync(tmp_path);
            var img_query = "UPDATE Squadre set SQ_IMAGE = "+req.file.originalname+" where SQ_ID_SQUADRA = "+ req.id_squadra;
            pool.getConnection(function(err,connection) {
                if (err) {
                    connection.release();
                    res.json({"code": 100, "status": "Error in connection database"});
                    return;
                }

                connection.query(img_query,function(err,rows){
                    if(!err) {
                        connection.query(check2,function(err,rows2){

                            connection.release();
                            if(!err){
                                res.redirect('/gestsq');
                            }
                        });

                    }
                });


                connection.on('error', function(err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});

                });

            });
        }
    );
    src.on('error', function(err) { res.render('error'); });

})

//////////////////////////
//////////// ELAB TORNEO
/////////////////////////
router.get('/elabtorneo*', function(req, res) {
    var pool = req.pool;
    var tid = req.query.tid;

    var check1 = "SELECT * FROM v_punti2 WHERE cod_torneo = "+tid+" AND nro_giornata = ( SELECT min(CAL_NRO_GIORNATA) from Calendario where CAL_COD_TORNEO = "+ tid+" AND CAL_PUNTI_HOME is null ) ";

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(check1,function(err,rows){
            connection.release();
            if(!err) {
                res.render('elabtorneo',{
                    "list" : rows
                });
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });

});
/////////////
//// UTENTE
/////////////
router.get('/utente',function(req,res){
    if(req.session.utente){
        sess_ute = new my_ute(res,req.pool,req.session.utente);
        sess_ute.init();
        sess_ute.render();
    }
    else {res.redirect('/login');}
});

router.post('/salvatorneo', function(req,res){
    var pool = req.pool;
    var tid = req.body.torneo;
    var ngio = req.body.giorn;
    var torn1upd = false;

    var q1 = "SELECT * FROM v_punti2 WHERE cod_torneo = "+tid+" AND nro_giornata = "+ngio;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(q1,function(err,rows){
            connection.release();
            if(!err) {
                var upd_q = '';
                var index;
                for (index = 0; index < rows.length; index++){
                    var upd = "UPDATE Calendario set CAL_PUNTI_HOME = "+rows[index].punti_casa+" , CAL_PUNTI_AWAY = " +rows[index].punti_away+" , CAL_GOL_HOME = "+rows[index].gol_casa+" , CAL_GOL_AWAY = "+rows[index].gol_away;
                    var wh = " WHERE CAL_COD_TORNEO = "+tid+" AND CAL_NRO_GIORNATA = "+ngio+" AND CAL_NRO_PARTITA = "+ rows[index].nro_partita+" ;";
                    var gir = upd +wh ;

                    upd_q = upd_q + gir;

                }

                pool.getConnection(function(err,connection){
                    if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                    }

                    console.log('connected as id ' + connection.threadId);

                    connection.query(upd_q,function(err,rows){
                        connection.release();
                        if(!err) {
                           // res.send('OK');
                            torn1upd = true;
                        }
                    });

                    connection.on('error', function(err) {
                        res.json({"code" : 100, "status" : "Error in connection database"});

                    });
                });
            }

        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });

//////GESTIONE COPPA
    var checkt = "select * from Torneo where TOR_COD_TORNEO ="+tid;
    var tiptorn = 1;

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        connection.query(checkt,function(err,rows){
            //connection.release();
            if(!err) {
               // res.send('OK');
                tiptorn = rows[0].TOR_TIPO_TORNEO;
            }
        });

        if(tiptorn == 1){
            /// TORNEO ALL'ITALIANA
            connection.release();
            if(torn1upd)
            {
                res.send('OK');
            }
        }
        else if(rows[0].TOR_TIPO_TORNEO == 3){
            /// COPPA

            // query ritorna 1 se è l'ultima giornata del turno, 0 altrimenti
            var chkturn = "SELECT IF( (select MAX(TU_NRO_GIORNATA) from TURNI where TU_COD_TORNEO = "+tid+" AND TU_NRO_TURNO = (select TU_NRO_TURNO from TURNI where TU_COD_TORNEO = "+tid+" AND TU_NRO_GIORNATA = "+ngio+" )) = "+ngio+" , 1, 0) as CHK1 from DUAL";
            var last = false;

            connection.query(chkturn, function(err, rows2){
                if(!err){
                    if(rows2[0].CHK1 == 1){
                        var upd_coppa = "CALL upd_coppa("+tid+","+ngio+")";
                        connection.query(upd_coppa,function(err, rows3){
                            connection.release();
                            res.send('OK');
                        });
                    }
                    else{
                        ///DISPUTATA L'ANDATA
                        connection.release();
                        if(torn1upd)
                        {
                            res.send('OK');
                        }
                    }
                }
            });

        }
        else{
            console.log('Non trovato torneo');
        }



        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    });


});

module.exports = router;
