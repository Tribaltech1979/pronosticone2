/**
 * Created by schiappacassed on 12/05/2016.
 */

var dbw = require("./dbworker.js");

function Utente (res, pool, ute){

    this.res = res;
    this.pool = pool;
    this.ute = ute;

    var tmquery = "select * from v_squadre where cod_ute = "+this.ute;
    var tor_query = " select v_torneo.*, t1.LIVE from v_torneo,";
    tor_query = tor_query + "  ( select distinct GIO_COD_TORNEO, if ( (convert_tz(sysdate(),'-1:00','+1:00') > addtime(GIO_DATA_INIZIO, GIO_ORA_INIZIO)) && (CAL_PUNTI_HOME is null),1,0) LIVE ";
    tor_query = tor_query + " from Giornate, Calendario" ;
    tor_query = tor_query +" where GIO_NRO_GIORNATA = (select min(nro_giornata) from v_insris where cod_torneo = GIO_COD_TORNEO and g_home is null)";
    tor_query = tor_query +" and GIO_COD_TORNEO = CAL_COD_TORNEO";
    tor_query = tor_query +" and GIO_NRO_GIORNATA = CAL_NRO_GIORNATA) as t1";
    tor_query = tor_query +" where cod_torneo = GIO_COD_TORNEO";
    tor_query = tor_query +" and cod_squadra =  "+rows[0].id_squadra;

    var cal_query = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where punti_home is null and ( cod_home = " + rows[0].id_squadra + " or cod_away = " + rows[0].id_squadra +" ) order by dt_inizio";

    var cal_past = "select *, date_format(dt_inizio,'%d/%m/%Y')'inizio',TIME_FORMAT(ora_inizio,'%H:%i')'ora' from v_global_calen where punti_home is not null and ( cod_home = " + rows[0].id_squadra + " or cod_away = " + rows[0].id_squadra +" ) order by dt_inizio desc";


};

Utente.prototype.init = function(){

};

Utente.prototype.render = function(){
    res.render('user', {"user": rows[0].nome_squadra,
        title: rows[0].nome_squadra + ' Homepage',
        "torneo": rows2,
        "calendario": rows3,
        "pastcal":rows4
    });
};

module.exports = Utente;