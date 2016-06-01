/**
 * Created by schiappacassed on 11/05/2016.
 */

function dbworker(pool, usrquery){
    this.pool = pool;
    this.usrquery = usrquery;
    this.row = this.pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        //console.log('connected as id ' + connection.threadId);

        connection.query(this.usrquery,function(err,rows){

            connection.release();

            if(!err){
                return rows;
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});

        });
    return rows;
    });

}