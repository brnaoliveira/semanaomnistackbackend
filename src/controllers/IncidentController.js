const Connection= require('../database/connection');

module.exports = {
    async index(Request, Response){
        const {page=1}= request.query;
        const [count] = await connection('incidents').count();

        console.log(count);
        
        const incidents = await Connection('incidents')
        .join('ongs','ongs.id','=','incidents.ong_id')
        .limit(5)
        .offset((page-1)*5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
          ]);

        response.header('X-Total-Count', count['count(*)']);
        return Response.json({id});

    },
    async create(Request, Response){
        const{title, description, value } = request.body;
        const ong_id = Request.headers.authorization;

        const[id]= await Connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return Response.json({id});
    },

    async delete(request,Response){
        const {id}= request.params;
        const ong_id = Request.headers.authorization;

        const incidents = await Connection('incidents')
        .where('id',id)
        .select('ong_id')
        .first();
        
        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
          }
      
          await connection('incidents').where('id', id).delete();
      
          return response.status(204).send();
        }

};