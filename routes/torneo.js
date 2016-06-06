/**
 * Created by schiappacassed on 11/05/2016.
 */

var dbw = require("./dbworker.js");

function Torneo(res, pool, tid,id_squadra, utente){

    this.res = res;
    this.pool = pool;
    this.tid = tid;
    this.id_squadra = id_squadra;
    this.utente = utente;

    this.class_query = 'select * from Torneo where TOR_COD_TORNEO = ' + this.tid ;
    this.past = "select * from v_global_calen where cod_torneo = "+ this.tid;
    this.q_massimo = "select max(GIO_NRO_GIORNATA)'tot_gio' from Giornate where GIO_COD_TORNEO = "+ this.tid;
    this.q_currgio = "select ifnull(max(nro_giornata),1)'cur_gio' from v_global_calen where cod_torneo = "+ this.tid+" and punti_home is not null";
    this.cal_query = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where cod_torneo = " + this.tid + " and dt_inizio > sysdate() and ( cod_home = " + this.id_squadra + " or cod_away = " + this.id_squadra + " ) order by dt_inizio";



    this.db_class_query = new dbw(pool,this.class_query);
    this.db_past = new dbw(pool,this.past);
    this.db_q_massimo = new dbw(pool,this.q_massimo);
    this.db_q_currgio = new dbw(pool,this.q_currgio);
    this.db_cal_query = new dbw(pool,this.cal_query);

    this.admin = false;
    this.padre = {};
    this.massimo = 1;
    this.mgio = 1;
    this.tipo_torneo = 1;
    this.title = '';
    this.image = '';



this.init = function(){

    this.db_class_query.getResult(function(row1){
    this.tipo_torneo = row1[0].TOR_TIPO_TORNEO;
    this.title = row1[0].TOR_DESCR_TORNEO;
    this.image = row1[0].TOR_IMAGE;

    var m_padre = {};

    if (this.tipo_torneo != 4) {
        if (row1[0].TOR_COD_PADRE) {
            var q_padr = " select * from Torneo where TOR_COD_PADRE = " + row1[0].TOR_COD_PADRE + " order by TOR_COD_TORNEO";
            var db_q_padr = new dbw(pool, q_padr);
            db_q_padr.getResult(function (res) {
                m_padre = res;
            }.bind(this));//q_pqdr
        }

        if (row1[0].TOR_COD_MASTER == this.utente) {
            this.admin = true;
        }


        this.db_q_massimo.getResult(function (row) {
            this.massimo = row[0].tot_gio;


            this.db_q_currgio.getResult(function (row) {
                this.mgio = row[0].cur_gio;

                ////RENDER

                var rows2 = {};
                this.db_cal_query.getResult(function (res) {
                    rows2 = res;


                    var rows3 = {};
                    this.db_past.getResult(function (res) {
                        rows3 = res;


                        if (this.tipo_torneo == 1) {
                            this.res.render('ttorneo', {
                                "title": this.title,
                                "image": this.image,
                                "numgiorn": this.massimo,
                                "curgio": this.mgio,
                                "padre": this.padre,
                                "tid": this.tid,
                                "admin": this.admin,
                                "calen": rows2,
                                "pcalen": rows3
                            });
                        }
                        else {
                            this.res.render('ttorneo2', {
                                "title": rows[0].TOR_DESCR_TORNEO,
                                "image": rows[0].TOR_IMAGE,
                                "numgiorn": this.massimo,
                                "curgio": this.mgio,
                                "padre": this.padre,
                                "tid": this.tid,
                                "admin": this.admin,
                                "calen": rows2,
                                "pcalen": rows3
                            });

                        }
                    }.bind(this)); //rows3
                }.bind(this));//rows2
            }.bind(this));//Current
        }.bind(this)); //massimo
    }
    else if (this.tipo_torneo == 4)
    {
        var class_q = "Select * from classifica_ex where cod_torneo = "+tid+" order by punti desc";
        var db_class_q = new dbw(this.pool, class_q);

        db_class_q.getResult(function(r_clas){
          var p_clas = r_clas;
        this.res.render('ttorneo3',{
            "title" : this.title,
            "image" : this.image,
            "tid": this.tid,
            "idsquadra" : this.id_squadra,
            "pclass" :p_clas
        });
    }.bind(this));// class query
    }
    }.bind(this));//row1
    
    //this.mgio = this.db_q_currgio.row[0].cur_gio;

};

this.render = function(){


};
}

module.exports = Torneo;