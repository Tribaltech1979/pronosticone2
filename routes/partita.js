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

    var check1= "SELECT if ( convert_tz(sysdate(),'-1:00','+1:00') < addtime(GIO_DATA_INIZIO, GIO_ORA_INIZIO), 1,0) as CH1, if (sysdate()> GIO_DATA_FINE,1,0) as CH2  FROM Giornate where GIO_COD_TORNEO = "+ this.tid + " and GIO_NRO_GIORNATA = "+ this.ngio;
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

    this.db_check1.getResult(function(res){
        this.checkOrario = res[0].CH1;
    }.bind(this));
    //this.checkOrario = this.db_check1.row[0].CH1;
    this.db_check2.getResult(function(res){
    this.cod_home = res[0].CAL_COD_HOME;
    this.cod_away = res[0].CAL_COD_AWAY;
    }.bind(this))
   // check2 = this.db_check2.row;



};

Partita.prototype.render = function(){

/// rows4 -> pron
    var rows4 = {};
/// per i risultati
    var rows2 = {};
    var rows3 = {};
    var rows0 = {};

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
            }.bind(this));

            this.res.render('compila2', {
                'title': "Inserimento risultati",
                'htab': rows4,
                'cod_torneo': this.tid,
                'nro_giorn': this.ngio
            });
        }
        else {
            res.render('aspetta', {
                'title': "Partita ancora da disputare"
            });
        }
    }
    else{
        /// Dopo l'inizio
        var p_query_h = "Select * from v_pronostico where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_home+" ;";
        var p_query_a = "Select * from v_pronostico where cod_torneo = "+this.tid+" and nro_giornata = "+this.ngio+" and pr_squadra = "+this.cod_away+" ;";
        var t_query = "Select * from v_global_calen where cod_torneo = "+this.tid+" and nro_giornata = "+ this.ngio+" and nro_partita = "+this.npar+" ;";

        var db_query_t = new dbw(this.pool,p_query_t);
        //rows0 = db_query_t.row;
        db_query_t.getResult(function(res){
            rows0=res;
        }.bind(this));

        var db_query_h = new dbw(this.pool,p_query_h);
        //rows2 = db_query_h.row;
        db_query_h.getResult(function(res){
            rows2=res;
        }.bind(this));
        
        var db_query_a = new dbw(this.pool,p_query_a);
        //rows3 = db_query_a.row;
        db_query_a.getResult(function(res){
            rows3=res;
        }.bind(this));

        this.res.render('risultato',{
            "title" : rows0[0].sq_home+" VS "+rows0[0].sq_away,
            "cod_torneo" : this.tid,
            "tes": rows0[0],
            "home": rows2,
            "away": rows3
        });


    }
};
    };

module.exports = Partita;