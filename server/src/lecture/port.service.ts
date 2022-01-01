import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Instructor } from '../entities/instructor';
import { Lesson } from '../entities/lesson';
import { Lecture } from '../entities/lecture';
import { ImportLessonDto } from './dto/import-lesson.dto';
import { TeachLecture } from '../entities/teach_lecture';
import { TeachLesson } from './dto/teach_lesson';
import { InstructorInfo } from './dto/instructorInfo';

@Injectable()
export class PortService {
  constructor(
    @InjectRepository(Instructor) private readonly InstructorRepo: Repository<Instructor>,
    @InjectRepository(Lesson) private readonly LessonRepo: Repository<Lesson>,
    @InjectRepository(Lecture) private readonly LectureRepo: Repository<Lecture>,
    @InjectRepository(TeachLecture) private readonly TeachRepo: Repository<TeachLecture>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  private instructor2str(ins: Instructor) {
    return ins.name.toLowerCase() + '@@' + ins.department.toLowerCase();
  }

  knownDup2 = new Map<string, InstructorInfo>()
    .set('李斌', {
      deparment: ['计算机科学技术学院', '软件学院', '信息科学与工程学院'],
      teach: ['SOFT130049', 'INFO130359'],
    });

  knownDuplicator = new Map<string, InstructorInfo>()
    .set('赵一鸣', {
      deparment: ['计算机科学技术学院', '软件学院'],
      teach: ['COMP130005', 'SOFT130014', 'SOFT130020', 'SOFT130012'],
    })
    .set('郭跃飞', {
      deparment: ['计算机科学技术学院', '信息科学与工程学院'],
      teach: ['MATH120017', 'COMP130006'],
    })
    .set('汪卫', {
      deparment: ['计算机科学技术学院', '信息科学与工程学院'],
      teach: ['COMP130020', 'INFO130373'],
    })
    .set('危辉', {
      deparment: ['计算机科学技术学院', '信息科学与工程学院'],
      teach: ['COMP130031', 'INFO130358'],
    })
    .set('杨夙', {
      deparment: ['计算机科学技术学院', '国际关系与公共事务学院'],
      teach: ['COMP110031', 'POLI110062'],
    })
    .set('章忠志', {
      deparment: ['计算机科学技术学院', '国际关系与公共事务学院'],
      teach: ['COMP120004', 'POLI110062'],
    })
    .set('陈碧欢', {
      deparment: ['计算机科学技术学院', '软件学院'],
      teach: ['COMP130112', 'SOFT130004'],
    })
    .set('邱锡鹏', {
      deparment: ['计算机科学技术学院', '大数据学院'],
      teach: ['DATA130006', 'COMP130014'],
    })
    .set('姜育刚', {
      deparment: ['计算机科学技术学院', '大数据学院'],
      teach: ['COMP130137', 'DATA130014'],
    })
    .set('吴杰', {
      deparment: ['计算机科学技术学院', '软件学院'],
      teach: ['COMP130116', 'SOFT130013'],
    })
    .set('周向东', {
      deparment: ['计算机科学技术学院', '大数据学院'],
      teach: ['COMP120006', 'DATA130015'],
    })
    .set('谈子敬', {
      deparment: ['计算机科学技术学院', '大数据学院'],
      teach: ['COMP130022', 'DATA130015'],
    })
    .set('周雅倩', {
      deparment: ['计算机科学技术学院', '大数据学院'],
      teach: ['COMP130135', 'DATA130036'],
    })
    .set('孙晓光', {
      deparment: ['计算机科学技术学院', '物理学系'],
      teach: ['COMP110007', 'PHYS120013'],
    })
    .set('张文强', {
      deparment: ['计算机科学技术学院', '物理学系'],
      teach: ['COMP110062', 'PHYS120014'],
    })
    .set('金玲飞', {
      deparment: ['计算机科学技术学院', '软件学院'],
      teach: ['COMP130068', 'SOFT130007'],
    })
    .set('张为华', {
      deparment: ['软件学院', '大数据学院', '计算机科学技术学院'],
      teach: ['SOFT130022', 'DATA130025', 'COMP130156'],
    })
    .set('韩伟力', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130004', 'COMP130166'],
    })
    .set('陈辰', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130059', 'COMP130144'],
    })
    .set('李景涛', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130023', 'COMP130069'],
    })
    .set('张源', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130077', 'COMP130158'],
    })
    .set('李弋', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130040', 'COMP130156'],
    })
    .set('陈翌佳', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['MATH110020'],
    })
    .set('朱东来', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130068'],
    })
    .set('张天戈', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['COMP130024', 'SOFT130017'],
    })
    .set('沈立炜', {
      deparment: ['软件学院', '计算机科学技术学院'],
      teach: ['SOFT130072', 'COMP130015'],
    })
    .set('彭娟', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['CHEM130005', 'MACR110011'],
    })
    .set('卢红斌', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['CHEM130005', 'MACR110011'],
    })
    .set('俞麟', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130004', 'CHEM130010'],
    })
    .set('姚晋荣', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130001', 'CHEM130010'],
    })
    .set('刘旭军', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130004', 'CHEM130007'],
    })
    .set('汪伟志', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130004', 'CHEM130003'],
    })
    .set('汤慧', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130007', 'CHEM130007'],
    })
    .set('冯嘉春', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130022', 'CHEM130006'],
    })
    .set('王国伟', {
      deparment: ['高分子科学系', '化学系'],
      teach: ['MACR130017', 'CHEM130003'],
    })
    .set('程元荣', {
      deparment: ['材料科学系', '化学系'],
      teach: ['MATE130062', 'CHEM130010'],
    })
    .set('钱再波', {
      deparment: ['材料科学系', '化学系'],
      teach: ['MATE130070', 'CHEM130005'],
    })
    .set('陈萌', {
      deparment: ['材料科学系', '化学系'],
      teach: ['CHEM119005'],
    })
    .set('梅永丰', {
      deparment: ['材料科学系', '复旦暑期国际项目'],
      teach: ['MATE110013'],
    })
    .set('梁子骐', {
      deparment: ['材料科学系', '复旦暑期国际项目'],
      teach: ['MATE130052', 'MATE170002'],
    })
    .set('杨芃原', {
      deparment: ['化学系', '临床医学院'],
      teach: ['CHEM130018', 'MED130336'],
    })
    .set('高海峰', {
      deparment: ['基础医学院', '数学科学学院'],
      teach: ['MED130041', 'MATH110020'],
    })
    .set('陆超', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED130144', 'GNUR130010'],
    })
    .set('洪晓武', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED130041', 'GNUR130008'],
    })
    .set('刘雷', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED115001', 'NURS115001'],
    })
    .set('徐晨', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED130152', 'GNUR130010'],
    })
    .set('周平', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED110047', 'GNUR130010', 'MED130013'],
    })
    .set('吕雷', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED130152', 'GNUR130010'],
    })
    .set('徐昕红', {
      deparment: ['基础医学院', '护理学院'],
      teach: ['MED130152', 'GNUR130009'],
    })
    .set('刘邦忠', {
      deparment: ['护理学院', '临床医学院'],
      teach: ['NURS110013', 'MED130342'],
    })
    .set('程云', {
      deparment: ['护理学院', '临床医学院'],
      teach: ['NURS110013', 'MED130299'],
    })
    .set('程秀娣', {
      deparment: ['护理学院', '体育教学部'],
      teach: ['GNUR110010', 'PEDU110112'],
    })
    .set('王俭', {
      deparment: ['护理学院', '体育教学部'],
      teach: ['GNUR110010', 'PEDU110091'],
    })
    .set('李静', {
      deparment: ['护理学院', '药学院'],
      teach: ['NURS130068', 'PHAR130140'],
    })
    .set('严金海', {
      deparment: ['数学科学学院', '管理学院'],
      teach: ['MATH120015', 'MATH120017'],
    })
    .set('徐惠平', {
      deparment: ['数学科学学院', '经济学院'],
      teach: ['MATH130019', 'ECON130105'],
    })
    .set('赵宇微', {
      deparment: ['数学科学学院', '经济学院'],
      teach: ['MATH130060', 'MATH120017'],
    })
    .set('林伟', {
      deparment: ['数学科学学院', '信息科学与工程学院'],
      teach: ['MATH130015', 'INFO130357'],
    })
    .set('杭国明', {
      deparment: ['数学科学学院', '旅游学系', '药学院', '历史学系'],
      teach: ['MATH119002', 'TOUR130001', 'PHAR130049', 'SOSC120017'],
    })
    .set('苏仰锋', {
      deparment: ['数学科学学院', '大数据学院'],
      teach: ['MATH130072', 'DATA130002'],
    })
    .set('谢践生', {
      deparment: ['数学科学学院', '大数据学院'],
      teach: ['MATH130015', 'DATA130024'],
    })
    .set('高卫国', {
      deparment: ['数学科学学院', '大数据学院'],
      teach: ['MATH130015', 'DATA130002'],
    })
    .set('陆立强', {
      deparment: ['数学科学学院', '经济学院'],
      teach: ['MATH119003', 'ECON130123'],
    })
    .set('朱胜林', {
      deparment: ['数学科学学院', '物理学系'],
      teach: ['MATH120011', 'PHYS130002'],
    })
    .set('应坚刚', {
      deparment: ['数学科学学院', '复旦暑期国际项目', '经济学院'],
      teach: ['MATH130014', 'MATH170001', 'MATH120016'],
    })
    .set('苏长和', {
      deparment: ['国际关系与公共事务学院', '马克思主义学院'],
      teach: ['SOSC120011', 'PTSS110068'],
    })
    .set('熊易寒', {
      deparment: ['国际关系与公共事务学院', '数学科学学院'],
      teach: ['POLI130149', 'MATH110020'],
    })
    .set('沈逸', {
      deparment: ['国际关系与公共事务学院', '教务处', '马克思主义学院'],
      teach: ['POLI130002', 'POLI116001', 'PTSS110079'],
    })
    .set('李瑞昌', {
      deparment: ['国际关系与公共事务学院', '继续教育学院'],
      teach: ['POLI130140', 'SOSC120018'],
    })
    .set('李春成', {
      deparment: ['国际关系与公共事务学院', '继续教育学院'],
      teach: ['POLI130175'],
    })
    .set('陈周旺', {
      deparment: ['国际关系与公共事务学院', '社会发展与公共政策学院'],
      teach: ['HIST110027', 'SOCI119003'],
    })
    .set('郦菁', {
      deparment: ['国际关系与公共事务学院', '社会发展与公共政策学院'],
      teach: ['POLI130153', 'SOCI119003'],
    })
    .set('黄河', {
      deparment: ['国际关系与公共事务学院', '中国语言文学系'],
      teach: ['POLI130027', 'CHIN120013'],
    })
    .set('刘永涛', {
      deparment: ['国际关系与公共事务学院', '复旦暑期国际项目'],
      teach: ['POLI130108', 'POLI170001'],
    })
    .set('徐静波', {
      deparment: ['国际关系与公共事务学院', '外国语言文学学院'],
      teach: ['POLI110028', 'FORE130270'],
    })
    .set('胡鹏', {
      deparment: ['国际关系与公共事务学院', '复旦暑期国际项目'],
      teach: ['POLI130149', 'POLI170006'],
    })
    .set('王浩', {
      deparment: ['国际关系与公共事务学院', '复旦暑期国际项目'],
      teach: ['POLI130030', 'POLI170007'],
    })
    .set('邹真真', {
      deparment: ['国际关系与公共事务学院', '国际文化交流学院'],
      teach: ['POLI130206', 'ICES130136'],
    })
    .set('刘宇', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['SOSC120020', 'ECON170007'],
    })
    .set('李丹', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['SOSC120004', 'ECON130200'],
    })
    .set('樊潇彦', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['ECON130193', 'ECON170010'],
    })
    .set('谢一青', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['SOSC120004', 'ECON170006'],
    })
    .set('陈硕', {
      deparment: ['经济学院', '国际关系与公共事务学院'],
      teach: ['ECON130010', 'POLI110062'],
    })
    .set('田素华', {
      deparment: ['经济学院', '社会发展与公共政策学院'],
      teach: ['ECON130022', 'SOCI119003'],
    })
    .set('尹晨', {
      deparment: ['经济学院', '社会发展与公共政策学院'],
      teach: ['ECON110027', 'SOCI130200'],
    })
    .set('王丽莉', {
      deparment: ['经济学院', '数学科学学院'],
      teach: ['SOSC120004', 'MATH130002'],
    })
    .set('刘庆富', {
      deparment: ['经济学院', '大数据学院'],
      teach: ['ECON130175', 'DATA130001'],
    })
    .set('吴力波', {
      deparment: ['经济学院', '大数据学院', '大气与海洋科学系'],
      teach: ['ECON130012', 'DATA130001', 'ATMO115001'],
    })
    .set('何喜有', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['ECON170004', 'ECON130063'],
    })
    .set('张军', {
      deparment: ['经济学院', '复旦暑期国际项目'],
      teach: ['ECON170008', 'SOSC120007'],
    })
    .set('张涛', {
      deparment: ['经济学院', '马克思主义学院'],
      teach: ['SOSC120005', 'PTSS110079'],
    })
    .set('潘天舒', {
      deparment: ['社会发展与公共政策学院', '基础医学院'],
      teach: ['SOCI130004', 'MED116002'],
    })
    .set('骆为祥', {
      deparment: ['社会发展与公共政策学院', '基础医学院'],
      teach: ['SOCI130054', 'MED116002'],
    })
    .set('付芳', {
      deparment: ['社会发展与公共政策学院', '基础医学院', '护理学院', '临床医学院'],
      teach: ['SOCI130073', 'MED116002', 'NURS130075', 'MED130416'],
    })
    .set('朱剑峰', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目', '基础医学院'],
      teach: ['SOCI130085', 'MED116002', 'SOCI170002'],
    })
    .set('洪浏', {
      deparment: ['社会发展与公共政策学院', '艺术教育中心'],
      teach: ['SOCI130108', 'FINE110086'],
    })
    .set('张力', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目'],
      teach: ['SOCI130039'],
    })
    .set('杨锦绵', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目'],
      teach: ['SOSC120013', 'SOCI170006'],
    })
    .set('田丰', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目'],
      teach: ['SOCI130147', 'SOCI170007'],
    })
    .set('于海', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目'],
      teach: ['SOCI130097', 'SOCI130137'],
    })
    .set('胡安宁', {
      deparment: ['社会发展与公共政策学院', '复旦暑期国际项目'],
      teach: ['SOCI130150', 'SOCI130137'],
    })
    .set('陈虹霖', {
      deparment: ['社会发展与公共政策学院', '继续教育学院'],
      teach: ['SOSC120012', 'SOCI120002'],
    })
    .set('李洁', {
      deparment: ['社会发展与公共政策学院', '学生工作部（处）'],
      teach: ['SOCI110023', 'PTSS110058'],
    })
    .set('司佳', {
      deparment: ['历史学系', '复旦暑期国际项目'],
      teach: ['HIST130126', 'HIST170004'],
    })
    .set('孙青', {
      deparment: ['历史学系', '复旦暑期国际项目'],
      teach: ['HIST130224', 'HIST170006'],
    })
    .set('冯玮', {
      deparment: ['历史学系', '国际关系与公共事务学院'],
      teach: ['HIST110001', 'POLI130093'],
    })
    .set('高晞', {
      deparment: ['历史学系', '基础医学院'],
      teach: ['HIST130229', 'MED130329'],
    })
    .set('段志强', {
      deparment: ['历史学系', '文物与博物馆学系'],
      teach: ['HIST130192', 'MUSE130088'],
    })
    .set('邓杰', {
      deparment: ['历史学系', '马克思主义学院', '复旦暑期国际项目'],
      teach: ['HIST130223', 'PTSS110008', 'PTSS170001'],
    })
    .set('张晓蓉', {
      deparment: ['管理学院', '复旦暑期国际项目'],
      teach: ['MANA130004', 'MANA170003'],
    })
    .set('方曙红', {
      deparment: ['管理学院', '复旦暑期国际项目'],
      teach: ['MANA130004', 'MANA170010'],
    })
    .set('戴伟辉', {
      deparment: ['管理学院', '复旦暑期国际项目'],
      teach: ['MANA110005', 'MANA170008'],
    })
    .set('古定威', {
      deparment: ['管理学院', '经济学院'],
      teach: ['SOSC120004', 'SOSC120017'],
    })
    .set('谢静', {
      deparment: ['新闻学院', '复旦暑期国际项目'],
      teach: ['JOUR130006', 'ICES170001'],
    })
    .set('沈国麟', {
      deparment: ['新闻学院', '复旦暑期国际项目'],
      teach: ['JOUR120009', 'JOUR170001'],
    })
    .set('周葆华', {
      deparment: ['新闻学院', '大数据学院'],
      teach: ['JOUR130112', 'DATA130036'],
    })
    .set('刘畅', {
      deparment: ['新闻学院', '社会发展与公共政策学院'],
      teach: ['JOUR130186', 'SOCI130029'],
    })
    .set('刘学礼', {
      deparment: ['马克思主义学院', '基础医学院'],
      teach: ['PTSS110067', 'MED130215'],
    })
    .set('马忠法', {
      deparment: ['法学院', '管理学院'],
      teach: ['LAWS110014', 'MANA130323'],
    })
    .set('张乃根', {
      deparment: ['法学院', '复旦暑期国际项目'],
      teach: ['LAWS130016', 'LAWS170002'],
    })
    .set('史大晓', {
      deparment: ['法学院', '复旦暑期国际项目'],
      teach: ['LAWS130018', 'LAWS170005'],
    })
    .set('王俊', {
      deparment: ['法学院', '复旦暑期国际项目'],
      teach: ['LAWS130015', 'LAWS170003'],
    })
    .set('梁咏', {
      deparment: ['法学院', '复旦暑期国际项目'],
      teach: ['LAWS119008', 'LAWS170001'],
    })
    .set('涂云新', {
      deparment: ['法学院', '计算机科学技术学院', '继续教育学院'],
      teach: ['LAWS120005', 'LAWS160001', 'LAWS130005'],
    })
    .set('姚军', {
      deparment: ['法学院', '计算机科学技术学院', '基础医学院'],
      teach: ['SOSC120003', 'COMP130115', 'MED116003'],
    })
    .set('杨新', {
      deparment: ['环境科学与工程系', '复旦暑期国际项目'],
      teach: ['ENVI119002', 'ENVI170001'],
    })
    .set('陈宏', {
      deparment: ['环境科学与工程系', '复旦暑期国际项目'],
      teach: ['ENVI110010', 'ENVI170001'],
    })
    .set('陈建民', {
      deparment: ['环境科学与工程系', '大气与海洋科学系'],
      teach: ['ENVI119006', 'ATMO110001'],
    })
    .set('成天涛', {
      deparment: ['环境科学与工程系', '大气与海洋科学系'],
      teach: ['ENVI130023', 'ATMO130004'],
    })
    .set('沈涵', {
      deparment: ['旅游学系', '复旦暑期国际项目', '历史学系'],
      teach: ['TOUR130058', 'HIST170005', 'TOUR130070'],
    })
    .set('王莎', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR110001', 'TOUR130069'],
    })
    .set('沈祖祥', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130057', 'TOUR130008'],
    })
    .set('孙云龙', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130038', 'TOUR130002'],
    })
    .set('郭旸', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['SOSC120004', 'SOSC120005'],
    })
    .set('沈莺', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130066', 'TOUR130081'],
    })
    .set('后智钢', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130020', 'TOUR110002'],
    })
    .set('吴本', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130064', 'TOUR130004'],
    })
    .set('巴兆祥', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130031', 'TOUR130045'],
    })
    .set('郭英之', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130013', 'TOUR130007'],
    })
    .set('王永刚', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130054', 'TOUR130075'],
    })
    .set('张歆梅', {
      deparment: ['旅游学系', '历史学系'],
      teach: ['TOUR130060', 'TOUR130019'],
    })
    .set('孙树林', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['INFO130232', 'PHYS120014'],
    })
    .set('张浩', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['INFO130023', 'PHYS120013'],
    })
    .set('倪刚', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['PHYS130107', 'PHYS130008'],
    })
    .set('朱鹤元', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['INFO130150', 'PHYS120013'],
    })
    .set('张宗芝', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['INFO130042', 'PHYS120014'],
    })
    .set('胡光喜', {
      deparment: ['信息科学与工程学院', '物理学系'],
      teach: ['INFO130102', 'PHYS120014'],
    })
    .set('盛卫东', {
      deparment: ['物理学系', '数学科学学院'],
      teach: ['PHYS130103', 'MATH110020'],
    })
    .set('乐永康', {
      deparment: ['物理学系', '核科学与技术系'],
      teach: ['PHYS120015', 'TCPH130048'],
    })
    .set('林青', {
      deparment: ['信息科学与工程学院', '微电子学院'],
      teach: ['INFO130037'],
    })
    .set('易婷', {
      deparment: ['信息科学与工程学院', '微电子学院'],
      teach: ['INFO120002', 'INFO130010'],
    })
    .set('陈国平', {
      deparment: ['信息科学与工程学院', '微电子学院'],
      teach: ['INFO130117'],
    })
    .set('黄芳', {
      deparment: ['信息科学与工程学院', '社会发展与公共政策学院', '基础医学院'],
      teach: ['SOCI110031', 'INFO115001', 'MED130272'],
    })
    .set('陈睿', {
      deparment: ['学生工作部（处）', '社会发展与公共政策学院', '信息科学与工程学院'],
      teach: ['PTSS110059', 'SOCI110031', 'INFO115001'],
    })
    .set('黄洁', {
      deparment: ['学生工作部（处）', '马克思主义学院', '艺术教育中心'],
      teach: ['PTSS110060', 'PTSS110061', 'FINE110085'],
    })
    .set('潘孝楠', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('陆晶婧', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('白鸽', {
      deparment: ['学生工作部（处）', '马克思主义学院', '公共卫生学院', '社会发展与公共政策学院'],
      teach: ['PTSS110061', 'PTSS110060', 'PHPM130095', 'SOCI110023'],
    })
    .set('茅盾', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110061'],
    })
    .set('季欣', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110060', 'PTSS110061'],
    })
    .set('陆优优', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('陈峰', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('郑阳', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('周序倩', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110058', 'PTSS110059'],
    })
    .set('盛情', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110058', 'PTSS110059'],
    })
    .set('朱佳', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('许妍', {
      deparment: ['学生工作部（处）', '马克思主义学院', '社会发展与公共政策学院'],
      teach: ['PTSS110061', 'PTSS110060', 'SOCI110023'],
    })
    .set('王怡静', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('付雁', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('王亚鹏', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('沈安怡', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110059'],
    })
    .set('王睿', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110061', 'PTSS110060'],
    })
    .set('刘佳琦', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('吕异颖', {
      deparment: ['学生工作部（处）', '马克思主义学院', '管理学院'],
      teach: ['PTSS110059', 'PTSS110058', 'MANA115002'],
    })
    .set('王银飞', {
      deparment: ['学生工作部（处）', '马克思主义学院'],
      teach: ['PTSS110059', 'PTSS110058'],
    })
    .set('于专宗', {
      deparment: ['学生工作部（处）', '公共卫生学院', '社会发展与公共政策学院'],
      teach: ['PHPM130095', 'PTSS010001', 'SOCI110023'],
    })
    .set('郑川', {
      deparment: ['核科学与技术系', '物理学系'],
      teach: ['TCPH130027', 'PHYS120013'],
    })
    .set('外教', {
      deparment: ['外国语言文学学院', '大学英语教学部'],
      teach: ['FORE130192', 'FORE110050'],
    })
    .set('万江波', {
      deparment: ['大学英语教学部', '外国语言文学学院'],
      teach: ['ENGL110069', 'FORE130345'],
    })
    .set('时丽娜', {
      deparment: ['大学英语教学部', '外国语言文学学院'],
      teach: ['ENGL110036', 'FORE130345'],
    })
    .set('姚燕瑾', {
      deparment: ['大学英语教学部', '国际文化交流学院'],
      teach: ['ENGL110025', 'ICES110010'],
    })
    .set('郭永秉', {
      deparment: ['中国语言文学系', '数学科学学院'],
      teach: ['CHIN119022', 'MATH110020'],
    })
    .set('蒋勇', {
      deparment: ['中国语言文学系', '管理学院'],
      teach: ['CHIN130147', 'ICES110010'],
    })
    .set('陆扬', {
      deparment: ['中国语言文学系', '复旦暑期国际项目'],
      teach: ['CHIN130129', 'CHIN170003'],
    })
    .set('徐瑾', {
      deparment: ['教务处', '学生工作部（处）'],
      teach: ['STUO110004', 'STUO110001'],
    })
    .set('吴新文', {
      deparment: ['哲学学院', '马克思主义学院'],
      teach: ['PHIL119027', 'PTSS110068'],
    })
    .set('尹洁', {
      deparment: ['哲学学院', '基础医学院'],
      teach: ['PHIL119010', 'MED116003'],
    })
    .set('孙向晨', {
      deparment: ['哲学学院', '基础医学院'],
      teach: ['PHIL130172', 'MED116002'],
    })
    .set('王国豫', {
      deparment: ['哲学学院', '基础医学院', '物理学系'],
      teach: ['PHIL130059', 'MED130329', 'PHYS110020'],
    })
    .set('汤铭钧', {
      deparment: ['哲学学院', '外国语言文学学院'],
      teach: ['PHIL130262', 'FORE110059'],
    })
    .set('刘震', {
      deparment: ['哲学学院', '外国语言文学学院', '历史学系'],
      teach: ['PHIL130167', 'FORE110058', 'HIST119028'],
    })
    .set('李胜海', {
      deparment: ['哲学学院', '外国语言文学学院'],
      teach: ['FORE110057', 'PHIL130154'],
    })
    .set('冯平', {
      deparment: ['哲学学院', '继续教育学院'],
      teach: ['PHIL110015'],
    })
    .set('林晖', {
      deparment: ['哲学学院', '新闻学院'],
      teach: ['PHIL130015', 'JOUR130202'],
    })
    .set('马建敏', {
      deparment: ['航空航天系', '信息科学与工程学院'],
      teach: ['MECH130032', 'INFO130307'],
    })
    .set('王和庆', {
      deparment: ['航空航天系', '信息科学与工程学院'],
      teach: ['MECH130032', 'INFO130307'],
    })
    .set('姚伟', {
      deparment: ['航空航天系', '环境科学与工程系'],
      teach: ['MECH130009', 'ENVI130078'],
    })
    .set('王伶俐', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130115'],
    })
    .set('范益波', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['MICR130003', 'INFO130331'],
    })
    .set('陶新萱', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['MICR130003', 'INFO120010'],
    })
    .set('黄煜梅', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['MICR120001', 'INFO120002'],
    })
    .set('唐长文', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['MICR120001', 'INFO120002'],
    })
    .set('周鹏', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130022'],
    })
    .set('来金梅', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['TFSY118004', 'INFO130009'],
    })
    .set('曾璇', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130021'],
    })
    .set('黄大鸣', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130116'],
    })
    .set('叶凡', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130270'],
    })
    .set('周晓方', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130038'],
    })
    .set('周学功', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130081'],
    })
    .set('仇志军', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130024'],
    })
    .set('朱恒亮', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130021'],
    })
    .set('周嘉', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130024'],
    })
    .set('韩军', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130038'],
    })
    .set('俞军', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130094'],
    })
    .set('周锋', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130004'],
    })
    .set('茹国平', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130028'],
    })
    .set('屈新萍', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130022'],
    })
    .set('林殷茵', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130271'],
    })
    .set('李宁', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO119001'],
    })
    .set('蒋玉龙', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130022'],
    })
    .set('胡春凤', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130027'],
    })
    .set('许俊', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130025'],
    })
    .set('陈赟', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130015'],
    })
    .set('曹伟', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130338'],
    })
    .set('任俊彦', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130026'],
    })
    .set('江安全', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130002'],
    })
    .set('李文宏', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130095'],
    })
    .set('荆明娥', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130001'],
    })
    .set('李巍', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130257'],
    })
    .set('闫娜', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130114'],
    })
    .set('卢红亮', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130109'],
    })
    .set('曾晓洋', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130009'],
    })
    .set('严昌浩', {
      deparment: ['微电子学院', '信息科学与工程学院'],
      teach: ['INFO130081'],
    })
    .set('张鹿', {
      deparment: ['艺术教育中心', '复旦暑期国际项目'],
      teach: ['FINE110068', 'PEDU170001'],
    })
    .set('邹彦', {
      deparment: ['艺术教育中心', '教务处'],
      teach: ['FINE110062'],
    })
    .set('戴微', {
      deparment: ['艺术教育中心', '教务处'],
      teach: ['FINE110060'],
    })
    .set('汤筠冰', {
      deparment: ['艺术教育中心', '新闻学院'],
      teach: ['FINE110063', 'JOUR130125'],
    })
    .set('王震', {
      deparment: ['体育教学部', '复旦暑期国际项目'],
      teach: ['PEDU110053', 'PEDU170002'],
    })
    .set('丰萍', {
      deparment: ['体育教学部', '复旦暑期国际项目'],
      teach: ['PEDU110107', 'PEDU170001'],
    })
    .set('孔繁辉', {
      deparment: ['体育教学部', '复旦暑期国际项目'],
      teach: ['PEDU110120', 'PEDU170002'],
    })
    .set('韦佶', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES110012'],
    })
    .set('范翔翔', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES130053', 'ICES170004'],
    })
    .set('毛金燕', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES170001', 'ICES110010'],
    })
    .set('许静', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES110013'],
    })
    .set('刘海霞', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES110012', 'ICES170004'],
    })
    .set('王蕾', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES110002', 'ICES170004'],
    })
    .set('耿直', {
      deparment: ['国际文化交流学院', '复旦暑期国际项目'],
      teach: ['ICES110002', 'ICES110011'],
    })
    .set('高凤楠', {
      deparment: ['大数据学院', '数学科学学院'],
      teach: ['DATA130009', 'MATH130142'],
    })
    .set('郦旭东', {
      deparment: ['大数据学院', '数学科学学院'],
      teach: ['DATA130023h', 'MATH130019'],
    })
    .set('邵美悦', {
      deparment: ['大数据学院', '数学科学学院'],
      teach: ['DATA130002', 'MATH120044'],
    })
    .set('薛迪', {
      deparment: ['公共卫生学院', '基础医学院'],
      teach: ['PHPM130061', 'MED130215'],
    })
    .set('傅华', {
      deparment: ['公共卫生学院', '基础医学院'],
      teach: ['PHPM130086', 'MED116001'],
    })
    .set('王帆', {
      deparment: ['公共卫生学院', '基础医学院'],
      teach: ['PHPM110059', 'MED130329'],
    })
    .set('杨肖光', {
      deparment: ['公共卫生学院', '国际关系与公共事务学院'],
      teach: ['PHPM119003', 'POLI110062'],
    })
    .set('刘宝', {
      deparment: ['公共卫生学院', '临床医学院'],
      teach: ['PHPM130047', 'MED130299'],
    })
    .set('张天嵩', {
      deparment: ['临床医学院', '复旦暑期国际项目'],
      teach: ['MED170001', 'MED130136'],
    })
    .set('吴晞', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED115004', 'MED130143'],
    })
    .set('曹文杰', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130143', 'MED130238'],
    })
    .set('郑克', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130234', 'MED130144'],
    })
    .set('陈莉', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130300', 'MED130220'],
    })
    .set('张伟伟', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130145', 'MED110060'],
    })
    .set('张自妍', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130143', 'MED130355'],
    })
    .set('白姣姣', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130355', 'NURS130061'],
    })
    .set('郭瑛', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED110060', 'GNUR110017'],
    })
    .set('黄喆', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130416', 'NURS130075'],
    })
    .set('来小彬', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130416', 'NURS130023'],
    })
    .set('冯国栋', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130035', 'NURS130023'],
    })
    .set('王宾', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130298', 'MED116001'],
    })
    .set('王海燕', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130028', 'MED130309'],
    })
    .set('王吉耀', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130021', 'MED116001'],
    })
    .set('陶文其', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110060', 'MED130078'],
    })
    .set('彭翔', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130143', 'MED130357'],
    })
    .set('徐文东', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130336'],
    })
    .set('李音', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130022', 'MED130144'],
    })
    .set('朱畴文', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130109', 'MED130329'],
    })
    .set('张明', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130143', 'MED130157'],
    })
    .set('卢洪洲', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130137', 'MED110001'],
    })
    .set('毛应启梁', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110054', 'MED130136'],
    })
    .set('涂彦渊', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130225', 'MED130145'],
    })
    .set('张向杰', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130185'],
    })
    .set('赵超', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130298', 'MED130211'],
    })
    .set('易志刚', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130137', 'MED130211'],
    })
    .set('吴唏', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED115002'],
    })
    .set('姜威', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED110061'],
    })
    .set('陈瑞芳', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130028'],
    })
    .set('张艳', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130243', 'MED130289'],
    })
    .set('胡越凯', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130109', 'MED130144'],
    })
    .set('钱金凤', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130028'],
    })
    .set('陈勤奋', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED116001', 'MED130022'],
    })
    .set('邹和建', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130215'],
    })
    .set('程训佳', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130290', 'MED130012'],
    })
    .set('桂永浩', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130167', 'MED116001'],
    })
    .set('杨震', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110057', 'MED130329'],
    })
    .set('袁正宏', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130007', 'MED130137'],
    })
    .set('崔恒官', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130338'],
    })
    .set('邵金炎', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110061', 'MED130144'],
    })
    .set('陆爱珍', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130231', 'MED130144'],
    })
    .set('孙维兰', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110063', 'MED130144'],
    })
    .set('王新宇', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130232'],
    })
    .set('李晓牧', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130158', 'MED130080'],
    })
    .set('张颖', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110052', 'MED130143'],
    })
    .set('陈波斌', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130190', 'MED130022'],
    })
    .set('李小英', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130080', 'MED130022'],
    })
    .set('沈茜', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130231', 'MED130144'],
    })
    .set('陈彤', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130022', 'MED130215'],
    })
    .set('储以微', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130209', 'MED130298'],
    })
    .set('朱依纯', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130042', 'MED130298'],
    })
    .set('孙凤艳', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130161', 'MED130298'],
    })
    .set('王宏胜', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130029'],
    })
    .set('储晨', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130029'],
    })
    .set('王健', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130083'],
    })
    .set('寿涓', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130083'],
    })
    .set('王旭', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130024', 'MED130242'],
    })
    .set('袁燕', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130158', 'MED130144'],
    })
    .set('黄一沁', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130289', 'MED130078'],
    })
    .set('李益明', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130022', 'MED130078'],
    })
    .set('王勇波', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130008', 'MED130265'],
    })
    .set('向阳', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130335'],
    })
    .set('狄扬', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130335'],
    })
    .set('刘懿', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130077', 'MED130021'],
    })
    .set('马慧', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130144', 'MED130335'],
    })
    .set('邹健', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130083', 'MED130143'],
    })
    .set('赵诸慧', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130029', 'MED130145'],
    })
    .set('米文丽', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110054', 'MED110055'],
    })
    .set('褚玉霞', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED110054', 'MED110055'],
    })
    .set('史冬梅', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130143', 'MED130218'],
    })
    .set('李雪松', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130023', 'MED130144'],
    })
    .set('张烁', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130308', 'MED130218'],
    })
    .set('阮巧玲', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130309', 'MED130218'],
    })
    .set('王莉英', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130170', 'MED130309'],
    })
    .set('龙志国', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130327', 'MED130145'],
    })
    .set('耿道颖', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130018', 'MED116001'],
    })
    .set('黄国英', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130029', 'MED116001'],
    })
    .set('董竞成', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130020', 'MED130352'],
    })
    .set('钱江', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130347', 'MED130156'],
    })
    .set('向萌', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED130013', 'MED130158'],
    })
    .set('吴劲松', {
      deparment: ['临床医学院', '基础医学院'],
      teach: ['MED116001', 'MED130026'],
    })
    .set('赖雁妮', {
      deparment: ['临床医学院', '基础医学院', '复旦暑期国际项目'],
      teach: ['MED130308', 'MED115002', 'MED170002'],
    })
    .set('张斌', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130028', 'NURS130069'],
    })
    .set('梁亮', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130018', 'NURS110016'],
    })
    .set('朱正飞', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130020'],
    })
    .set('沈婕', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130028', 'NURS130065'],
    })
    .set('郑莹', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130020'],
    })
    .set('叶尘宇', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130017', 'GNUR130015'],
    })
    .set('鹿欣', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130063'],
    })
    .set('易晓芳', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130230', 'NURS130063'],
    })
    .set('李斌', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130063'],
    })
    .set('李儒芝', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130068'],
    })
    .set('程海东', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130028', 'NURS130068'],
    })
    .set('胡蓉', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130028', 'NURS130068'],
    })
    .set('熊钰', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130068'],
    })
    .set('张庆英', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130068'],
    })
    .set('常建华', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130020'],
    })
    .set('朱骥', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130020'],
    })
    .set('徐焕', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130069'],
    })
    .set('肖喜荣', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130028', 'NURS130069'],
    })
    .set('张玉', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130187', 'NURS130069'],
    })
    .set('李笑天', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130154', 'NURS130069'],
    })
    .set('成文武', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130416', 'NURS130020', 'MED116001'],
    })
    .set('沈洁', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130020'],
    })
    .set('程群', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130187', 'NURS130075'],
    })
    .set('陈萌蕾', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130019', 'NURS130075'],
    })
    .set('戚少华', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130342', 'NURS110013'],
    })
    .set('陈嘉莹', {
      deparment: ['临床医学院', '护理学院'],
      teach: ['MED130225', 'NURS130068'],
    })
    .set('赵静', {
      deparment: ['临床医学院', '大学英语教学部'],
      teach: ['MED130035', 'ENGL110073'],
    })
    .set('朱斌', {
      deparment: ['临床医学院', '药学院'],
      teach: ['MED130288', 'PHAR130137'],
    })
    .set('程能能', {
      deparment: ['药学院', '临床医学院'],
      teach: ['PHAR130113', 'MED130298'],
    })
    .set('周璐', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130014', 'CHEM120011'],
    })
    .set('张伟', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130014', 'CHEM120011'],
    })
    .set('丁宁', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130015', 'CHEM120011'],
    })
    .set('达慎思', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130014', 'CHEM120011'],
    })
    .set('楚勇', {
      deparment: ['药学院', '化学系'],
      teach: ['CHEM120003', 'CHEM120011'],
    })
    .set('古险峰', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130015', 'CHEM120011'],
    })
    .set('王洁', {
      deparment: ['药学院', '化学系'],
      teach: ['PHAR130014', 'CHEM120011'],
    })
    .set('章益涵', {
      deparment: ['新闻学院', '临床医学院', '公共卫生学院'],
      teach: ['JOUR130244'],
    })
    .set('陆帆', {
      deparment: ['生命科学学院', '艺术教育中心'],
      teach: ['BIOL130047', 'FINE110092'],
    })
    .set('卢大儒', {
      deparment: ['生命科学学院', '数学科学学院'],
      teach: ['BIOL119009', 'MATH110020'],
    })
    .set('薛磊', {
      deparment: ['生命科学学院', '数学科学学院'],
      teach: ['BIOL130039', 'MATH110020'],
    })
    .set('张梦翰', {
      deparment: ['生命科学学院', '国际关系与公共事务学院'],
      teach: ['BIOL119004', 'POLI110062'],
    })
    .set('俞洪波', {
      deparment: ['生命科学学院', '信息科学与工程学院'],
      teach: ['BIOL130039', 'INFO130346'],
    })
    .set('王磊', {
      deparment: ['生命科学学院', '基础医学院'],
      teach: ['BIOL119009', 'MED130348'],
    })
    .set('鲁伯埙', {
      deparment: ['生命科学学院', '基础医学院'],
      teach: ['BIOL130146', 'MED130406'],
    })
    .set('张锋', {
      deparment: ['生命科学学院', '基础医学院'],
      teach: ['BIOL110023', 'MED130417'],
    })
    .set('李士林', {
      deparment: ['生命科学学院', '基础医学院'],
      teach: ['BIOL119004', 'MED110004'],
    });

  private isConflictedName(ins: Instructor, code: string) {
    switch (ins.name) {
      case '刘晔':
        return ['POLI110064'].includes(code);
      case '王磊':
        return ['MED130221'].includes(code);
      case '王海鹏':
        return ['MED110060'].includes(code);
      case '张力':
        return ['DATA130051'].includes(code);
      case '张松':
        return ['TCPH130001h'].includes(code);
      case '陶俊':
        return ['MECH130024'].includes(code);
      case '陈涛':
        return ['INFO130372'].includes(code);
      case '张鹏':
        return ['COMP130138'].includes(code);
      case '钱浩祺':
        return ['POLI130212'].includes(code);
      case '徐晓华':
        return ['NURS130061'].includes(code);
      case '刘铁江':
        return ['COMP130173'].includes(code);
      case '杨涛':
        return ['MED130359'].includes(code);
      case '王亮':
        return ['COMP110045'].includes(code);
      case '王娜':
        return ['NURS130043'].includes(code);
      case '陈钊':
        return ['DATA130028'].includes(code);
      case '徐辉':
        return ['COMP130159'].includes(code);
      case '李斌':
        return ['SOFT130049'].includes(code);
      case '凌云':
        return ['MED130137'].includes(code);
      case '沈杰':
        return ['MED130187'].includes(code);
      case '刘星':
        return ['MED130015'].includes(code);
      case '王放':
        return ['BIOL130122'].includes(code);
      case '王敏':
        return ['MATH130001'].includes(code);
      case '唐俊':
        return ['JOUR130206'].includes(code);
      case '王芳':
        return ['SOCI110023'].includes(code);
      case '秦枫':
        return ['SOCI110023'].includes(code);
      case '李伟':
        return ['NURS110016', 'CHEM130070'].includes(code);
      case '张新':
        return ['MANA130359'].includes(code);
      case '刘建平':
        return ['MED130157'].includes(code);
      case '曾璇':
        return ['MED115003'].includes(code);
      case '李昕':
        return ['FORE130456'].includes(code);
      case '沈洁':
        return ['MED130019'].includes(code);
      case '张军':
        return ['MED130050'].includes(code);
      case '刘建军':
        return ['MED130145'].includes(code);
      case '徐峰':
        return ['MED130171'].includes(code);
      case '陶磊':
        return ['MED130157'].includes(code);
      case '张洁':
        return ['MED130033'].includes(code);
      case '王薇':
        return ['PHPM130061'].includes(code);
      case '张斌':
        return ['MED130028'].includes(code);
      case '李巍':
        return ['MED130233'].includes(code);
      case '张波':
        return ['MACR110005'].includes(code);
      case '李宁':
        return ['MED130109'].includes(code);
      case '王靖':
        return ['NURS130068'].includes(code);
      case '洪涛':
        return ['MED130024'].includes(code);
      case '张琪':
        return ['MED130024'].includes(code);
      case '王超':
        return ['MED130230'].includes(code);
      case '陈敏':
        return ['BIOL110044'].includes(code);
      case '王艳':
        return ['MED130337'].includes(code);
      case '高翔':
        return ['MED130288'].includes(code);
      case '张艳':
        return ['MED130243'].includes(code);
      case '刘洋':
        return ['MED130243'].includes(code);
      case '陈阳':
        return ['MED130049'].includes(code);
      case '程群':
        return ['MED130187'].includes(code);
      case '吴杰':
        return ['MED130031'].includes(code);
      case '陆炜':
        return ['MED130231'].includes(code);
      case '杨帆':
        return ['MED130160'].includes(code);
      case '张勇':
        return ['MED130177'].includes(code);
      case '刘敏':
        return ['MED130137'].includes(code);
      case '沈伟':
        return ['MED130244'].includes(code);
      case '张浩':
        return ['PHYS120013'].includes(code);
      case '孙宁':
        return ['MED130329'].includes(code);
      case '张静':
        return ['MED130158'].includes(code);
      case '王颖':
        return ['MED130018'].includes(code);
      case '张楠':
        return ['MED130269', 'DATA130004'].includes(code);
      case '陈新':
        return ['MED130269'].includes(code);
      case '马涛':
        return ['ECON110015'].includes(code);
      case '李志远':
        return ['ECON130203'].includes(code);
      case '王伟':
        return ['MED130226', 'LAWS130029'].includes(code);
      case '王蕾':
        return ['ATMO115001'].includes(code);
      case '姚伟':
        return ['MED130081'].includes(code);
      case '赵俊':
        return ['ENGL110049'].includes(code);
      case '高虹':
        return ['ECON110033'].includes(code);
      case '王健':
        return ['DATA130018', 'MED130144'].includes(code);
      case '林青':
        return ['PTSS110062'].includes(code);
      case '王勇':
        return ['INFO130016'].includes(code);
      case '陈瑜':
        return ['NURS130002', 'MED130136'].includes(code);
      case '张巍':
        return ['MATH120013', 'MED130018'].includes(code);
      case '张勤':
        return ['ENGL110064'].includes(code);
      case '张雪梅':
        return ['TCPH130006'].includes(code);
      case '张伟':
        return ['TCPH130006', 'MED130187'].includes(code);
      case '周平':
        return ['XDSY118003'].includes(code);
      case '陈刚':
        return ['PHAR130003', 'MUSE130053'].includes(code);
      case '李聪':
        return ['PHAR130092'].includes(code);
      case '李丹':
        return ['ENVI130002'].includes(code);
      case '杭国明':
        return ['TOUR130001', 'PHAR130049'].includes(code);
      case '陈琳':
        return ['PTSS110057', 'SOCI130019', 'INFO130103'].includes(code);
      case '姚凯':
        return ['SOCI110031'].includes(code);
      case '王珺':
        return ['MATE130050'].includes(code);
      case '季欣':
        return ['MATE110024'].includes(code);
      case '蔡晓月':
        return ['JOUR130058'].includes(code);
      case '徐蔚':
        return ['INFO130288'].includes(code);
      case '姚晋荣':
        return ['CHEM130010'].includes(code);
      case '郑志':
        return ['GNUR130009'].includes(code);
      case '刘佳琦':
        return ['PTSS110059'].includes(code);
      case '李辉':
        return ['POLI130011'].includes(code);
      case '刘平':
        return ['PHIL119047'].includes(code);
      case '梅永丰':
        return ['MATE110013'].includes(code);
      case '石磊':
        return ['MATH130015', 'PHYS120013', 'MED116001'].includes(code);
      case '徐建明':
        return ['MECH130100'].includes(code);
      case '冯玮':
        return ['CHEM130004'].includes(code);
      case '杨青':
        return ['ECON110016', 'BIOL110044'].includes(code);
      case '张奇':
        return ['COMP130123'].includes(code);
      case '张涛':
        return ['SOSC120005', 'NURS130076', 'PHPM130068'].includes(code);
      case '张华':
        return ['JOUR130050'].includes(code);
      case '张颖':
        return ['MED110052', 'CHEM130096h'].includes(code);
      case '王永刚':
        return ['CHEM120009'].includes(code);
      case '王志强':
        return ['LAWS130044'].includes(code);
      case '陈力奋':
        return ['MECH130046'].includes(code);
      case '李炜':
        return ['SOCI110030', 'PHYS120013'].includes(code);
      case '李楠':
        return ['CHIN119005', 'ECON130212'].includes(code);
      case '李劲':
        return ['MED110072'].includes(code);
      }
  }

  private isInstCorrect(insts: string[], ins: Instructor, code: string) {
    const knownInsts = new Set(insts.filter((k) => k.split('@@')[0] === ins.name));
    let matched = false;
    knownInsts.forEach((k) => {
      if (k.split('@@')[1] === ins.department) {
        matched = true;
      }
    });
    if (knownInsts.size !== 0 && !matched && !this.isConflictedName(ins, code)) {
      return false;
    }
    return true;
  }

  private semesterFormatted(semester: string) {
    // 2020-2021学年2学期
    const sems = semester.match(/(\d){4}-(\d){4}学年\d学期|(\d){4}-(\d){4}学年暑期学期/g);
    if (sems === null) {
      this.loggerService.warn(`unknown semester format: ${semester}`);
    } else if (sems[0][11] === '1' || '2') {
      return sems[0].substring(5, 9) + (sems[0][11] === '1' ? '秋' : '春');
    } else {
      return sems[0].substring(5, 9) + '暑期';
    }
  }

  async importLessonBatch(lessones: ImportLessonDto[]) {
    await getConnection().transaction(async (transactionalEntityManager) => {
      const newInstructors: Instructor[] = [];
      const newTeaches: TeachLecture[] = [];
      const convertedLessones: Lesson[] = [];
      const updatedLects: Lecture[] = [];
      const oddTeaches: TeachLesson[] = [];

      const instructors = await this.InstructorRepo.find();
      let totalInst = instructors.length;
      const instMapper = new Map<string, Instructor>();
      for (const instructor of instructors) {
        instMapper.set(this.instructor2str(instructor), instructor);
      }

      const oldLessones = await this.LessonRepo.find();
      const lessonMapper = new Map<number, Lesson>();
      for (const lesson of oldLessones) {
        lessonMapper.set(lesson.id, lesson);
      }

      const lectures = await this.LectureRepo.find();
      let totalLect = lectures.length;
      // 全部的课程
      const lectMapper = new Map<string, Lecture[]>();
      // 该学期的课程
      const newLectMapper = new Map<string, Lecture[]>();

      const oldTeaches = await this.TeachRepo.find();

      if (lessones.length === 0) {
        return;
      }

      const semester = this.semesterFormatted(lessones[0].semester);

      for (const lecture of lectures) {
        if (!lectMapper.has(lecture.code)) {
          lectMapper.set(lecture.code, new Array<Lecture>());
        }
        const lects = lectMapper.get(lecture.code);
        lects.push(lecture);
        lectMapper.set(lecture.code, lects);
      }

      for (const lesson of lessones) {
        const instSet = new Set<string>();
        const newInsts: Instructor[] = [];

        for (const name of lesson.teachers.split(',')) {
          let instructor = new Instructor();
          instructor.name = name;
          instructor.department = lesson.department;
          if (this.knownDuplicator.has(name)) {
            const instInfo = this.knownDuplicator.get(name);
            if (instInfo.deparment.includes(lesson.department) || instInfo.teach.includes(lesson.code)) {
              instructor.department = instInfo.deparment[0];
            }
            if (this.knownDup2.has(name)) {
              const instInfo2 = this.knownDup2.get(name);
              if (instInfo2.deparment.includes(lesson.department) || instInfo2.teach.includes(lesson.code)) { 
                instructor.department = instInfo2.deparment[0];
              }
            }
          }
          if (!this.isInstCorrect(Array.from(instMapper.keys()), instructor, lesson.code)) {
            // 出现老师所在院系和数据库不一致
            // 这里 continue 了则需要手动添加 instructor 和 teach
            if (name !== '') {
              oddTeaches.push({
                instructorName: instructor.name,
                lessonCode: lesson.code,
              });
            }
            if (name === '') {
              continue;
            }
          }
          const key = this.instructor2str(instructor);
          if (!instMapper.has(key)) {
            totalInst += 1;
            instructor.id = totalInst;
            instMapper.set(key, instructor);
            newInstructors.push(instructor);
          } else {
            instructor = instMapper.get(key);
          }
          if (!instSet.has(name.toLowerCase())) {
            instSet.add(name.toLowerCase());
          }
          newInsts.push(instructor);
        }

        const taughtBy = [...instSet].sort().join('@@');

        const convertedLesson = new Lesson();
        convertedLesson.id = lesson.id;
        convertedLesson.code = lesson.code;
        convertedLesson.codeFull = lesson.no;
        convertedLesson.semester = lesson.semester;
        convertedLesson.taughtBy = taughtBy;
        convertedLesson.name = lesson.name;
        convertedLesson.credit = lesson.credits;
        convertedLesson.department = lesson.department;
        convertedLesson.campus = lesson.campusName;
        convertedLesson.remark = lesson.remark;
        convertedLesson.examType = lesson.examFormName;
        convertedLesson.examTime = lesson.examTime;
        convertedLesson.withdrawable = lesson.withdrawable;
        convertedLesson.timeSlot = lesson.arrangeInfo;
        convertedLesson.category = lesson.category;
        convertedLesson.maxStudent = lesson.maxStudent;
        convertedLessones.push(convertedLesson);

        if (!lectMapper.has(lesson.code)) {
          lectMapper.set(lesson.code, new Array<Lecture>());
        }
        if (!newLectMapper.has(lesson.code)) {
          newLectMapper.set(lesson.code, new Array<Lecture>());
        }
        const lects = lectMapper.get(lesson.code);
        const newLects = newLectMapper.get(lesson.code);
        const idx = lects.findIndex((v) => v.taughtBy.toString().toLowerCase() === taughtBy.toLowerCase());
        const newIdx = newLects.findIndex((v) => v.taughtBy.toString().toLowerCase() === taughtBy.toLowerCase());
        if (idx === -1) {
          // 全新的课程
          totalLect += 1;
          const newLect = new Lecture();
          newLect.id = totalLect;
          newLect.code = lesson.code;
          newLect.taughtBy = taughtBy;
          newLect.name = lesson.name;
          newLect.category = lesson.category;
          newLect.semester = semester;
          lects.push(newLect);
          newLects.push(newLect);
          updatedLects.push(newLect);
          lectMapper.set(newLect.code, lects);
          newLectMapper.set(newLect.code, newLects);
          for (const inst of newInsts) {
            const teach = new TeachLecture();
            teach.instructorId = inst.id;
            teach.lectureId = newLect.id;
            if (oldTeaches.findIndex((v) => v === teach) === -1) {
              newTeaches.push(teach);
              oldTeaches.push(teach);
            }
          }
        } else {
          // 以前已经有的课程
          if (newIdx === -1) {
            // 这学期没有的课程
            const lect = lects[idx];
            lect.semester += `,${semester}`;
            newLects.push(lect);
            newLectMapper.set(lect.code, newLects);
            updatedLects.push(lect);
          }
        }
      }
      await transactionalEntityManager.save(convertedLessones);
      await transactionalEntityManager.save(updatedLects);
      await transactionalEntityManager.save(newInstructors);
      await transactionalEntityManager.save(newTeaches);
      this.loggerService.warn(
        `导入课程成功，共添加 ${convertedLessones.length} 条 lesson，修改 ${updatedLects.length} 条 lecture，添加 ${
          newInstructors.length
        } 位 instructor 以及 ${newTeaches.length} 条 teach，其中可疑的课程: ${JSON.stringify(oddTeaches)}`,
      );
    });
  }
}
