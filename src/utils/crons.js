import { scheduleJob } from "node-schedule";
import couponModel from "../../DB/models/cupon.model.js"
import { DateTime } from "luxon";


export function cronToChangeExpiredCoupon(){
    scheduleJob('*/5 * * * * *',async()=>{
        console.log("this jop runs every 5 second");
        const coupons=await couponModel.find({couponStatus:'valid'}) 
        console.log(coupons);
        for (const coupon of coupons) {
            if(
                DateTime.fromISO(coupon.toDate)<DateTime.now()
            ){
                coupon.couponStatus='expired'
            }
            
            await coupon.save()
        }
    })
}
