
import * as routers from './modules/index.routes.js'
import db_connection from '../DB/connection.js';
import { globalResponse } from './middlewares/global-response.middleware.js';
import { rollbackUploadedFiles } from './middlewares/rollback-uploaded-files.middleware.js';
import { rollbackSavededDocuments } from './middlewares/rollback-saved-documents.middleware.js';
import { cronToChangeExpiredCoupon } from './utils/crons.js';


export const initiateApp=(app,express)=>{
    const port = process.env.PORT;

    app.use(express.json());
    db_connection()
    app.use('/user',routers.userRouter)
    app.use('/auth',routers.authRouter)
    app.use('/category',routers.categoryRouter)
    app.use('/subCategory',routers.subCategoryRouter)
    app.use('/brand',routers.brandRouter)
    app.use('/product',routers.productRouter)
    app.use('/cart',routers.cartRouter)
    app.use('/coupon',routers.couponRouter)
    app.use('/order',routers.orderRouter)
    app.use('/review',routers.reviewRouter)
    
    app.use(globalResponse,rollbackUploadedFiles,rollbackSavededDocuments)

    cronToChangeExpiredCoupon()
    
    app.listen(port, () => console.log(`listening on http://localhost:${port}`));
    
    
    
}