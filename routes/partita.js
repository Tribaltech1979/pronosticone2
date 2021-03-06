/**
 * Created by schiappacassed on 11/05/2016.
 */

var dbw = require("./dbworker.js");

function Partita(res, pool, tid, ngio, npar, utente, id_squadra){

    this.res = res;
    this.pool = pool;
    this.tid = tid;
    this.ngio = ngio;
    this.npar = npar;
    this.utente = utente;
    this.id_squadra = id_squadra;
    
   // console.log("id_squadra :"+id_squadra);
    
    this.tipo = 0;

    var check1= "SELECT if ( convert_tz(sysdate(),'-1:00','+1:00') < addtime(GIO_DATA_INIZIO, GIO_ORA_INIZIO), 1,0) as CH1, if (sysdate()> GIO_DATA_FINE,1,0) as CH2 , ifnull(GIO_TIPO,0) as tipo , GIO_DATA_INIZIO, GIO_ORA_INIZIO FROM Giornate where GIO_COD_TORNEO = "+ this.tid + " and GIO_NRO_GIORNATA = "+ this.ngio;
    var check2= 'SELECT * FROM Calendario where CAL_COD_TORNEO = ' + this.tid + ' and CAL_NRO_GIORNATA = '+this.ngio+' and CAL_NRO_PARTITA = '+ this.npar;
    var pron = 'SELECT * FROM v_pronostico where cod_torneo = '+this.tid+' and nro_giornata = '+this.ngio+' and pr_squadra = '+ this.id_squadra;
    //var t_query = "Select * from v_global_calen where cod_torneo = "+this.tid+" and nro_giornata = "+ this.ngio+" and nro_partita = "+this.npar+" ;";



    this.db_check1 = new dbw(this.pool,check1);
    this.db_check2 = new dbw(this.pool,check2);
    this.db_pron = new dbw(this.pool,pron);
   // this.db_t_query = new dbw(this.poo,t_query);

// 0 è già passata, 1 è prima
    this.checkOrario = 0;
// squadra di casa
    this.cod_home = 0;
    this.cod_away = 0;




this.init = function() {

    var check2 = {};
    /// rows4 -> pron
    var rows4 = {};
/// per i risultati
    var rows2 = {};
    var rows3 = {};
    var rows0 = {};

    this.db_check1.getResult(function(res){
    if(!res.length){this.res.redirect('/utente');}
        else{
        this.checkOrario = res[0].CH1;
        this.tipo = res[0].tipo;
        var giorno = res[0].CAL_DATA_INIZIO ;
        var ora = res[0].CAL_ORA_INIZIO;

    //this.checkOrario = this.db_check1.row[0].CH1;
        this.db_check2.getResult(function(res){
        this.cod_home = res[0].CAL_COD_HOME;
        this.cod_away = res[0].CAL_COD_AWAY;
          //  console.log("tipo :"+this.tipo);
        //    console.log("id_squadra :"+this.id_squadra);
          //  console.log("cod_home :"+this.cod_home);
            if(this.tipo == 0){
                if(this.checkOrario == 1) {
                    /// Prima dell'inizio
                    if (
                        (this.id_squadra == this.cod_home)
                        ||
                        (this.id_squadra == this.cod_away)
                        ) {

                        //rows4 = this.db_pron.row;
                        this.db_pron.getResult(function(res){
                            rows4 = res;


                            this.res.render('compila2', {
                                'title': "Inserimento risultati",
                                'htab': rows4,
                                'cod_torneo': this.tid,
                                'nro_giorn': this.ngio
                            });
                        }.bind(this)); //rows4
                    }
                    else {
                        this.res.render('aspetta', {
                            'title': "Risultati non ancora disponibili",
                            'giorno' : giorno,
                            'ora' : ora
                        });
                    }
                }
                else{
                    /// Dopo l'inizio
                    var p_query_h = "Select * from v_pronostico where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home+" ;";
                    var p_query_a = "Select * from v_pronostico where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_away+" ;";
                    var t_query = "Select * from v_global_calen where cod_torneo = "+this.tid+" and nro_giornata = "+ this.ngio+" and nro_partita = "+this.npar+" ;";

                    var db_query_t = new dbw(this.pool,t_query);
                    //rows0 = db_query_t.row;
                    db_query_t.getResult(function(res){
                        rows0=res;


                        var db_query_h = new dbw(this.pool,p_query_h);
                        //rows2 = db_query_h.row;
                        db_query_h.getResult(function(res){
                            rows2=res;


                            var db_query_a = new dbw(this.pool,p_query_a);
                            //rows3 = db_query_a.row;
                            db_query_a.getResult(function(res){
                                rows3=res;


                                this.res.render('risultato',{
                                    "title" : rows0[0].sq_home+" VS "+rows0[0].sq_away,
                                    "cod_torneo" : this.tid,
                                    "tes": rows0[0],
                                    "home": rows2,
                                    "away": rows3
                                });
                            }.bind(this)); //p_query_a
                        }.bind(this)); //p_query_h
                    }.bind(this)); //t_query


                }

            }
            else if (this.tipo == 1){
                if(this.checkOrario == 1) {
                    /// Prima dell'inizio
                    if (this.id_squadra == this.cod_home)
                         {

                        //rows4 = this.db_pron.row;
                        this.db_pron.getResult(function(res){
                            rows4 = res;

                            var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                            var db_next_q = new dbw(this.pool,next_q);
                            
                            db_next_q.getResult(function(res_max){
                                
                                var nextg = 0;
                                
                                if(res_max[0].gmax > this.ngio){
                                    nextg = parseInt(1) + parseInt(this.ngio);
                                }
                                
                               // console.log("next g: "+nextg);
                                
                                this.res.render('compila_new', {
                                'title': "Inserimento risultati",
                                'htab': rows4,
                                'cod_torneo': this.tid,
                                'nro_giorn': this.ngio,
                                'next_g' : nextg,
                                'par' : this.id_squadra    
                            });
                                
                            }.bind(this));


                            
                        }.bind(this)); //rows4
                    }
                    else {
                       this.res.render('aspetta', {
                            'title': "Risultati non ancora disponibili",
                            'giorno' : giorno,
                            'ora' : ora
                        });
                    }
                }
                else{
                    /// Dopo l'inizio
                    var p_query_h = "Select * from v_pronostico where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home+" ;";



                        var db_query_h = new dbw(this.pool,p_query_h);
                        //rows2 = db_query_h.row;
                        db_query_h.getResult(function(res){
                            rows2=res;

                            var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                            var db_next_q = new dbw(this.pool,next_q);

                            db_next_q.getResult(function(res_max){

                                var nextg = 0;

                                if(res_max[0].gmax > this.ngio){
                                    nextg = parseInt(1) + parseInt(this.ngio);
                                }

                                this.res.render('risultato_new2',{
                                    "title" : "Visualizza Pronosticone",
                                    "cod_torneo" : this.tid,
                                    "home": rows2,
                                    "next_g" : nextg,
                                    "par" : this.cod_home
                                });

                            }.bind(this));
                        }.bind(this)); //p_query_h

                }

            }
            else if (this.tipo == 2){
             if (this.checkOrario == 1){
                 if (this.id_squadra == this.cod_home){
                        var query_comp = "select * from v_compila_2 where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.id_squadra;
                        
                       // console.log(this.pool);
                        //console.log(query_comp);
                     
                        var db_query_comp = new dbw(this.pool, query_comp);
                        db_query_comp.getResult(function(res){
                            var rows4 = res;
                            
                            //console.log(rows4);
                            
                            var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                            var db_next_q = new dbw(this.pool,next_q);
                            
                            db_next_q.getResult(function(res_max){

                                var select_values = "select PX_VALUE 'value' from Partite_ex_val where PX_COD_TORNEO = "+this.tid;
                                
                                db_select_values = new dbw(this.pool,select_values);
                                db_select_values.getResult(function(opt){
                                    
                                var nextg = 0;
                                
                                if(res_max[0].gmax > this.ngio){
                                    nextg = parseInt(1) + parseInt(this.ngio);
                                }
                                
                                this.res.render('compila_new2', {
                                'title': "Inserimento risultati",
                                'htab': rows4,
                                'opt1': opt,    
                                'cod_torneo': this.tid,
                                'nro_giorn': this.ngio,
                                'next_g' : nextg,
                                'par' : this.id_squadra    
                                    
                                });
                                
                            }.bind(this));
                                
                            }.bind(this));


                            
                        }.bind(this)); //rows4
                 }
                 else{
                             //console.log(res[0]);        
                             this.res.render('aspetta', {
                            'title': "Risultati non ancora disponibili",
                            'giorno' : giorno,
                            'ora' : ora
                        });
                 }
             }
                else{
                         /// Dopo l'inizio
                 var query_comp = "select * from v_compila_2 where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home;

                 // console.log(this.pool);
                 //console.log(query_comp);

                 var db_query_comp = new dbw(this.pool, query_comp);
                 db_query_comp.getResult(function(res){
                     var rows4 = res;

                     //console.log(rows4);

                     var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                     var db_next_q = new dbw(this.pool,next_q);

                     db_next_q.getResult(function(res_max){



                             var nextg = 0;

                             if(res_max[0].gmax > this.ngio){
                                 nextg = parseInt(1) + parseInt(this.ngio);
                             }

                             this.res.render('risultato_new3', {
                                 'title': "Visualizza Pronosticone",
                                 'htab': rows4,
                                 'cod_torneo': this.tid,
                                 'nro_giorn': this.ngio,
                                 'next_g' : nextg,
                                 'par' : this.cod_home

                             });


                     }.bind(this));



                 }.bind(this)); //rows4

                }
            }
            else if (this.tipo == 3){
                            if (this.checkOrario == 1){
                 if (this.id_squadra == this.cod_home){
                        var query_comp = "select * from v_compila_2 where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home;
                     
                        var db_query_comp = new dbw(this.pool, query_comp);
                        db_query_comp.getResult(function(res){
                            rows4 = res;

                            var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                            var db_next_q = new dbw(this.pool,next_q);
                            
                            db_next_q.getResult(function(res_max){
                                
                                var select_values = "select PX_VALUE 'value' from Partite_ex_val where PX_COD_TORNEO = "+this.tid;
                                
                                db_select_values = new dbw(this.pool,select_values);
                                db_select_values.getResult(function(opt){
                                    
                                var nextg = 0;
                                
                                if(res_max[0].gmax > this.ngio){
                                    nextg = parseInt(1) + parseInt(this.ngio);
                                }
                                
                                this.res.render('compila_new3', {
                                'title': "Inserimento risultati",
                                'htab': rows4,
                                'opt1': opt,    
                                'cod_torneo': this.tid,
                                'nro_giorn': this.ngio,
                                'next_g' : nextg,
                                'par' : this.cod_home  
                                    
                                });
                                
                            }.bind(this));
                                
                            }.bind(this));


                            
                        }.bind(this)); //rows4
                 }
                 else{
                    //console.log(res[0]);            
                       this.res.render('aspetta', {
                            'title': "Risultati non ancora disponibili",
                            'giorno' : giorno,
                            'ora' : ora
                        });
                    
                 }
             }
                else{
                         /// Dopo l'inizio
                                /// Dopo l'inizio
                                var query_comp = "select * from v_compila_2 where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home;

                                // console.log(this.pool);
                                //console.log(query_comp);

                                var db_query_comp = new dbw(this.pool, query_comp);
                                db_query_comp.getResult(function(res){
                                    var rows4 = res;

                                    //console.log(rows4);

                                    var next_q = "Select max(GIO_NRO_GIORNATA) as gmax from Giornate where GIO_COD_TORNEO = "+this.tid;
                                    var db_next_q = new dbw(this.pool,next_q);

                                    db_next_q.getResult(function(res_max){



                                        var nextg = 0;

                                        if(res_max[0].gmax > this.ngio){
                                            nextg = parseInt(1) + parseInt(this.ngio);
                                        }

                                        this.res.render('risultato_new4', {
                                            'title': "Visualizza Pronosticone",
                                            'htab': rows4,
                                            'cod_torneo': this.tid,
                                            'nro_giorn': this.ngio,
                                            'next_g' : nextg,
                                            'par' : this.cod_home

                                        });


                                    }.bind(this));



                                }.bind(this)); //rows4

                }
            }

        }.bind(this)); //check2
    }
    }.bind(this)); //check1
   // check2 = this.db_check2.row;



};

this.render = function(){




};
    };

module.exports = Partita;