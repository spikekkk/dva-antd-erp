/*
 *	打印学员自助签到信息
 * @param orgName 机构名称
 * @param orgName 学员姓名
 * @param scheduleType 排课类型
 * @param courseName 课程名称
 * @param classroomName 教室名称
 * @param signType 签到类型
 * @param costNum 花费课时数
 * @param signTime 签到时间
 */
export function lodopPrintStuSignSelf(orgName, stuName, parentName, signTime) {
    if(window.LODOP) {
        window.LODOP.PRINT_INIT(stuName + "扫描自助签到");
        window.LODOP.SET_PRINT_PAGESIZE(3,480,30);
        window.LODOP.SET_PRINT_STYLEA("FontName","微软雅黑");
        window.LODOP.ADD_PRINT_TEXT(15,12,'48mm',20, orgName);
        window.LODOP.ADD_PRINT_TEXT(45,5,'45mm',20, "宝宝姓名: " + stuName);
        window.LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
        window.LODOP.SET_PRINT_STYLEA(1,"FontSize",10);
        window.LODOP.SET_PRINT_STYLEA(2,"FontSize",10);

        window.LODOP.ADD_PRINT_TEXT(65,8,'45mm',20,"签到家长: " + parentName);
        window.LODOP.ADD_PRINT_TEXT(80,8,'45mm',20,"签到时间: " + signTime);
        window.LODOP.SET_PRINT_STYLEA(4,"FontSize",8);
        window.LODOP.SET_PRINT_STYLEA(5,"FontSize",8);
//        window.LODOP.ADD_PRINT_IMAGE(145,15,'25mm','25mm','http://115.29.172.104/gimg/img/4b62c614920ee745be5845082fa08190');
//
//        window.LODOP.PREVIEW();
//        window.LODOP.PRINT_SETUP();
        window.LODOP.PRINT();
    } else {

    }

}
