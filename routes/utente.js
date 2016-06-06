/**
 * Created by schiappacassed on 12/05/2016.
 */

var dbw = require("./dbworker.js");

function Utente (res, pool, ute){

    this.res = res;
    this.pool = pool;
    this.ute = ute;

    this.tmquery = "select * from v_squadre where cod_ute = "+this.ute;


    this.id_squadra = 0;
    this.nome_squadra = '';
    this.tor_res = {};
    this.cal_res = {};
    this.cal_past = {};



this.init = function(){
    
    var m_id_squadra, m_nome_squadra;

    //console.log(this.pool, this.tmquery);
    var db_tmquery = new dbw(this.pool, this.tmquery);
    db_tmquery.getResult(function(res){
        if(!res.length){
            console.log(this.ute);
            
            this.res.redirect('/');
        }
        else{
         console.log("squadra in :" + res[0].id_squadra);
    this.id_squadra = res[0].id_squadra;
    this.nome_squadra =res[0].nome_squadra;   
        
    
    var tor_query = " select v_torneo.*, t1.LIVE from v_torneo,";
    tor_query = tor_query + "  ( select distinct GIO_COD_TORNEO, if ( (convert_tz(sysdate(),'-1:00','+1:00') > addtime(GIO_DATA_INIZIO, GIO_ORA_INIZIO)) && (CAL_PUNTI_HOME is null),1,0) LIVE ";
    tor_query = tor_query + " from Giornate, Calendario" ;
    tor_query = tor_query +" where GIO_NRO_GIORNATA = (select min(nro_giornata) from v_insris where cod_torneo = GIO_COD_TORNEO and g_home is null)";
    tor_query = tor_query +" and GIO_COD_TORNEO = CAL_COD_TORNEO";
    tor_query = tor_query +" and GIO_NRO_GIORNATA = CAL_NRO_GIORNATA) as t1";
    tor_query = tor_query +" where cod_torneo = GIO_COD_TORNEO";
    tor_query = tor_query +" and cod_squadra =  "+this.id_squadra;

    var cal_query = "select v_global_calen.*, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora', sav.PRO_SAVE 'save' from v_global_calen, v_cal_save sav where sav.PRO_COD_TORNEO = cod_torneo and sav.GIO_NRO_GIORNATA = nro_giornata and sav.PRO_COD_UTENTE = "+this.id_squadra +" and punti_home is null and ( cod_home = " + this.id_squadra + " or cod_away = " + this.id_squadra +" ) order by dt_inizio, nro_giornata";

    var cal_past = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where punti_home is not null and ( cod_home = " + this.id_squadra + " or cod_away = " + this.id_squadra +" ) order by dt_inizio desc, nro_giornata";


    var db_tor_query = new dbw(this.pool, tor_query);
    db_tor_query.getResult(function(res){
        this.tor_res = res;
    
    //this.tor_res = db_tor_query.row;
    //console.log(this.tor_res);

    var db_cal_query = new dbw(this.pool, cal_query);
    db_cal_query.getResult(function(res){
        this.cal_res = res;
    

    var db_cal_past = new dbw(this.pool, cal_past);
        db_cal_past.getResult(function(res){
        this.cal_past = res;
            
            
    this.res.render('user', 
      {"user": this.nome_squadra,
        title: this.nome_squadra + ' Homepage',
        "torneo": this.tor_res,
        "calendario": this.cal_res,
        "pastcal": this.cal_past});
            
    }.bind(this));
    }.bind(this));    
    }.bind(this));
        }
    }.bind(this));
};

this.render = function(){



    
};
};
module.exports = Utente;