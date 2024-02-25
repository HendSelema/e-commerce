
import * as routers from './modules/index.routes.js'
import db_connection from '../DB/connection.js';
import { globalResponse } from './middlewares/global-response.middleware.js';


export const initiateApp=(app,express)=>{
    const port = process.env.PORT;

    app.use(express.json());
    db_connection()
    app.use('/user',routers.userRouter)
    app.use('/auth',routers.authRouter)
    app.use('/category',routers.categoryRouter)
    app.use('/subCategory',routers.subCategoryRouter)
    
    app.use(globalResponse)
    
    app.listen(port, () => console.log(`listening on http://localhost:${port}`));
    
    
    
}