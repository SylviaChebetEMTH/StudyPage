# from random import choice, sample
# from flask import current_app
# from app import db, app
# from models import Expert, Service, expert_services, User
# import logging

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def generate_experts():
#     logger.info("🌱 Starting Expert Generation...")

#     try:
#         services = Service.query.all()
#         if not services:
#             logger.error("❌ No services found in the database!")
#             return False

#         logger.info(f"Found {len(services)} services")

#         # ✅ Gender-Specific Data
#         male_first_names = [
#             'James', 'Michael', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Ethan', 'Daniel', 'Matthew',
#             'Jackson', 'Sebastian', 'David', 'Joseph', 'Samuel', 'Carter', 'Owen', 'Wyatt', 'John', 'Jack',
#             'Luke', 'Julian', 'Levi', 'Isaac', 'Anthony', 'Grayson', 'Joshua', 'Christopher', 'Andrew', 'Nathan'
#         ]
#         female_first_names = [
#             'Sarah', 'Emily', 'Olivia', 'Emma', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
#             'Harper', 'Evelyn', 'Abigail', 'Ella', 'Scarlett', 'Grace', 'Lily', 'Hannah', 'Aria', 'Chloe',
#             'Penelope', 'Riley', 'Zoey', 'Nora', 'Lucy', 'Victoria', 'Madeline', 'Stella', 'Leah', 'Aurora'
#         ]
#         last_names = [
#             'Smith', 'Brown', 'Williams', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
#             'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
#             'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green'
#         ]

#         profile_pics_male = [
#             "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
#             "https://t3.ftcdn.net/jpg/03/33/01/30/240_F_333013089_rLm76bpH8O4umraRShSLqLD667bPpvhW.jpg",
#             "https://t3.ftcdn.net/jpg/08/44/38/58/240_F_844385865_TX6AWu9nFXwN9mA2yPvpeTHn8fbndhHq.jpg  ",
#             "https://t3.ftcdn.net/jpg/05/26/60/52/240_F_526605284_O2zMSOvCx4VIGY2nQKlbavo3UW9w0oDF.jpg",
#             "https://t4.ftcdn.net/jpg/10/50/84/95/240_F_1050849528_HMn1btjZvKZHZMc2gfLvSuwn7thAbeno.jpg ",
#             "https://t4.ftcdn.net/jpg/02/54/77/97/240_F_254779767_ROEK4ANl9nl6J1fHhsjnQ8X62Znro9N5.jpg",
#             "https://t4.ftcdn.net/jpg/03/56/33/75/240_F_356337517_lPKBgCGCHYHfmJCV7zlPbvqlf41j66xi.jpg",
#             "https://t4.ftcdn.net/jpg/08/16/92/91/240_F_816929101_gy8vZBUXwLrfYpPazGWPyyi9la4BmRlf.jpg",
#             "https://t4.ftcdn.net/jpg/04/98/99/45/240_F_498994507_BzNm5bADa9GbvxvlgRLFwrc4FetmBmqi.jpg",
#             "https://t3.ftcdn.net/jpg/02/00/90/24/240_F_200902415_G4eZ9Ok3Ypd4SZZKjc8nqJyFVp1eOD6V.jpg",
#             "https://t4.ftcdn.net/jpg/04/22/82/39/240_F_422823992_ZtyrE96o6wGTJcyZolZ6pLRUGHBRCH9c.jpg",
#             "https://t3.ftcdn.net/jpg/02/22/85/16/240_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg",
#             "https://t3.ftcdn.net/jpg/01/70/01/74/240_F_170017413_JHNYFqcpk0aHER9fdnEsETLKafT8rmb0.jpg",
#             "https://t4.ftcdn.net/jpg/04/64/87/43/240_F_464874339_Rc7McGaz327ljzgnWgke4crdDAdI2Yu2.jpg",
#             "https://t4.ftcdn.net/jpg/04/32/89/63/240_F_432896398_99o08tTgBYj8YP2eatvF4zaJu3AdF40E.jpg",
#             "https://t4.ftcdn.net/jpg/02/59/16/27/240_F_259162782_NYDGmbwSM4RQcYC55YAPbVban4G0n5t1.jpg",
#             "https://t3.ftcdn.net/jpg/02/83/12/96/240_F_283129653_iDQrlBEDpYWbKyDIUotS0Dy8ngUwQBaz.jpg",
#             "https://t3.ftcdn.net/jpg/02/07/55/70/240_F_207557081_uh1w4xm9CGqjFLJgrQKYPm9kiASOCPqx.jpg",
#             "https://t3.ftcdn.net/jpg/04/97/66/28/240_F_497662812_7rGW6PMBJR9AbrKcGgN5S1luXYTjH92i.jpg",
#             "https://t4.ftcdn.net/jpg/01/82/22/03/240_F_182220324_QiTjkB3IPwx1zfNltFA4ww3dKQyYvVWB.jpg",
#             "https://t4.ftcdn.net/jpg/03/58/96/39/240_F_358963988_b3FQwLD5wWOmETSvBvLBsBLBtW2z4yUW.jpghttps://t4.ftcdn.net/jpg/03/25/73/59/240_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg",
#             "https://t4.ftcdn.net/jpg/03/86/67/53/240_F_386675348_DkbPRVtBEM55bi2wkGgeEDljzC94rjEu.jpg",
#             "https://t3.ftcdn.net/jpg/03/91/34/72/240_F_391347204_XaDg0S7PtbzJRoeow3yWO1vK4pnqBVQY.jpg",
#             "https://t4.ftcdn.net/jpg/03/64/21/11/240_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
#             "https://t4.ftcdn.net/jpg/06/27/07/63/240_F_627076328_I08lO6C7wYCSjAODeOUyT2ZsyVROe6am.jpg",
#             "https://t4.ftcdn.net/jpg/03/10/07/91/240_F_310079187_l8nBUkpNLpiJ0icGYLAcTbmkxwedmwLO.jpg",
#             "https://t3.ftcdn.net/jpg/07/75/21/26/240_F_775212627_bymcLmHCTPZWAQsuZBMzra3oIEgJLJ36.jpg",
#             "https://t4.ftcdn.net/jpg/03/14/14/45/240_F_314144513_p1hwYePWAvtCR2dD4AiSLJfvLvaxwRub.jpg"
#             "https://t4.ftcdn.net/jpg/02/15/55/93/240_F_215559319_9gwwdzuLgUwt5nW0Tu2baATXQbceyx6y.jpg",
#             "https://t4.ftcdn.net/jpg/01/95/65/17/240_F_195651759_479r5S6Rx77XBSLHJQY2qd2xiwiRGAxB.jpg",
#             "https://t4.ftcdn.net/jpg/02/74/40/77/240_F_274407759_qu3T1jj0UAu9XtSNNB6xHhn7JKKcN2c3.jpg"
#         ]
#         profile_pics_female = [
#             "https://t4.ftcdn.net/jpg/03/83/25/83/240_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
#             "https://t3.ftcdn.net/jpg/02/43/76/54/240_F_243765470_a0hN5zuTKIonTbRGldi8KajuvhSiWvDx.jpg",
#             "https://t3.ftcdn.net/jpg/02/30/40/74/240_F_230407433_uF2iM6tUs1Sge24999FWdo241t8FMBi7.jpg",
#             "https://t4.ftcdn.net/jpg/03/13/37/31/240_F_313373132_b9Az7XaGLRvSLHXlINXBIGPMIOLok8ZB.jpg",
#             "https://t4.ftcdn.net/jpg/01/51/99/39/240_F_151993994_mmAYzngmSbNRr6Fxma67Od3WHrSkfG5I.jpg",
#             "https://t3.ftcdn.net/jpg/03/36/94/42/240_F_336944276_tpWzmwFi6JfZln5VlfBC1BZu5jgDOAl8.jpg",
#             "https://t4.ftcdn.net/jpg/03/38/90/37/240_F_338903738_RT7vLyCCZeWWvKD42waga3xej2CGFnXW.jpg",
#             "https://t3.ftcdn.net/jpg/03/29/43/72/240_F_329437299_hMz77tiEfQNBbxbX3kRi5HHj4XLlnL4K.jpg",
#             "https://t3.ftcdn.net/jpg/05/43/81/34/240_F_543813442_xjCP4hC52tRTSVp52LSEWr4A12YNyS0l.jpg",
#             "https://t3.ftcdn.net/jpg/03/22/36/32/240_F_322363271_hPT8kGlozwmhfGyA7O08Q7SIvCGUNBhv.jpg",
#             "https://t3.ftcdn.net/jpg/05/22/14/24/240_F_522142457_na0JOOqIXgRMOrgjJItfshoaZlutd3fV.jpg",
#             "https://t4.ftcdn.net/jpg/05/17/69/51/240_F_517695126_xVHlxMfMqZlBw1dtwgtiRKjunSjxX0wj.jpg",
#             "https://t3.ftcdn.net/jpg/02/22/10/62/240_F_222106228_NP5f0gXi3JOCgmaTsEyg7RuyKgwDLGuY.jpg",
#             "https://t4.ftcdn.net/jpg/01/70/01/71/240_F_170017144_y0Y9gnV3q55VNk7dnCRlK4LE1B3e9DFx.jpg",
#             "https://t4.ftcdn.net/jpg/05/35/28/93/240_F_535289317_lrX9mbQwwRd4Bn3kvxL442XjtNJtZxjy.jpg",
#             "https://t3.ftcdn.net/jpg/05/83/41/98/240_F_583419866_97XPxjHDJkQ2RKMmGWdgrbqJhEZeQb55.jpg",
#             "https://t3.ftcdn.net/jpg/02/68/73/32/240_F_268733269_DAOUAU8ioiNKOqRC8PWwji2k5MJQfx1j.jpg",
#             "https://t3.ftcdn.net/jpg/04/14/88/12/240_F_414881258_971wmhPNTLEwKUGXDPJy4Ql7pViomUOl.jpg",
#             "https://t3.ftcdn.net/jpg/03/34/52/14/240_F_334521438_mmtaUtbWMXYCLCtXXNFnivH6wUH60JDc.jpg",
#             "https://t3.ftcdn.net/jpg/07/37/28/54/240_F_737285469_LeX6IZBI4x7wt0VIKkHKVC2o5WfZ4vww.jpg",
#             "https://t4.ftcdn.net/jpg/03/16/72/71/240_F_316727117_LWSUJQxKbgPz4ucNsucp7j3AzGrjJW7U.jpg",
#             "https://t3.ftcdn.net/jpg/04/90/01/32/240_F_490013276_52jMVHNKvG6TJkaUi4Fsh2ICpXEhE3ZG.jpg",
#             "https://t4.ftcdn.net/jpg/03/36/97/95/240_F_336979582_9YQipUAfPEfKF6gZ5EfzT5b8U3vWJsFJ.jpg",
#             "https://t3.ftcdn.net/jpg/03/47/93/50/240_F_347935076_Oqu4VcxwQlh0LT6vrJzxVoxtI71HNmAc.jpg",
#             "https://t3.ftcdn.net/jpg/03/15/07/04/240_F_315070495_eCR5IjbhVfflbx4TPVLrjROgTEfMzjVU.jpg",
#             "https://t3.ftcdn.net/jpg/07/66/62/06/240_F_766620682_pRCdLBW8iq8mS84LWKtpBx4Xu26Cvkl5.jpg",
#             "https://t3.ftcdn.net/jpg/03/55/74/14/240_F_355741445_3NYNN44EbPN7JF7LQQQW7fbhgSTYzNyt.jpg",
#             "https://t3.ftcdn.net/jpg/05/39/16/60/240_F_539166003_yaH6Qx19KpHLbMpegfP7oTX2VFNsCoZk.jpg",
#             "https://t4.ftcdn.net/jpg/05/50/81/29/240_F_550812955_gEsXs9EtB1CUxQD9Bnspgko8AHAwxp8f.jpg",
#             "https://t3.ftcdn.net/jpg/05/13/74/48/240_F_513744811_ERHfVz9cR7pZe8mpvV7JknobjILKBGH7.jpg",
#             "https://t3.ftcdn.net/jpg/05/28/52/94/240_F_528529413_Cjkpm5Ccyr4iwf75vGfOvI4vNJE4rXDu.jpg",
#         ]

#         experts_created = 0
#         for service in services:
#             # ✅ Strictly filter experts based on matching subject & project type
#             matched_experts = Expert.query.filter(
#                 Expert.project_types.any(id=service.project_type_id),
#                 Expert.subjects.any(id=service.subject_id)
#             ).all()
            
#             existing_experts = (
#                 Expert.query
#                 .join(expert_services)
#                 .filter(expert_services.c.service_id == service.id)
#                 .count()
#             )

#             if existing_experts >= 3:
#                 logger.info(f"✅ Service '{service.title}' already has {existing_experts} experts.")
#                 continue

#             num_to_assign = 3 - existing_experts
#             assigned_experts = set()
#             logger.info(f"🔹 Assigning {num_to_assign} experts to '{service.title}'")
#             used_pics_male, used_pics_female = set(), set()

#             # ✅ Reuse existing matched experts before creating new ones
#             while len(assigned_experts) < num_to_assign:
#                 is_male = choice([True, False])

#                 if is_male:
#                     first_name = choice(male_first_names)
#                     available_pics = list(set(profile_pics_male) - used_pics_male)
#                     if not available_pics:
#                         used_pics_male.clear()
#                         available_pics = profile_pics_male
#                     profile_picture = choice(available_pics)
#                     used_pics_male.add(profile_picture)
#                 else:
#                     first_name = choice(female_first_names)
#                     available_pics = list(set(profile_pics_female) - used_pics_female)
#                     if not available_pics:
#                         used_pics_female.clear()
#                         available_pics = profile_pics_female
#                     profile_picture = choice(available_pics)
#                     used_pics_female.add(profile_picture)

#                 last_name = choice(last_names)
#                 full_name = f"{first_name} {last_name}"

#                 # ✅ Create a new user for the expert
#                 new_user = User(
#                     username=full_name,
#                     is_admin=False
#                 )
#                 db.session.add(new_user)
#                 db.session.commit()

#                 # ✅ Create a new expert profile
#                 expert = Expert(
#                     id=new_user.id,
#                     name=full_name,
#                     title=f"{service.title} Specialist",
#                     expertise=f"Expert in {service.title}",
#                     description=f"{full_name} specializes in {service.title}.",
#                     biography="Highly skilled professional with years of experience.",
#                     education="PhD in relevant field",
#                     languages="English, French",
#                     profile_picture=profile_picture,
#                 )
#                 db.session.add(expert)
#                 db.session.commit()

#                 # ✅ Assign expert to the service
#                 expert.services.append(service)
#                 db.session.commit()
#                 assigned_experts.add(expert)

#                 logger.info(f"✅ Created expert: {full_name} for '{service.title}' with image {profile_picture}")

#         logger.info(f"✅ Successfully assigned experts to services!")
#         return True

#     except Exception as e:
#         logger.error(f"❌ Error during expert generation: {str(e)}")
#         db.session.rollback()
#         return False

# if __name__ == "__main__":
#     with app.app_context():
#         success = generate_experts()
#         if not success:
#             logger.error("Expert generation failed!")



from random import choice, sample
from flask import current_app
from app import db, app
from models import Expert, Service, expert_services, User
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_experts():
    logger.info("🌱 Starting Expert Generation...")

    try:
        services = Service.query.all()
        if not services:
            logger.error("❌ No services found in the database!")
            return False

        logger.info(f"Found {len(services)} services")

        # ✅ Gender-Specific Data
        male_first_names = [
            'James', 'Michael', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Ethan', 'Daniel', 'Matthew',
            'Jackson', 'Sebastian', 'David', 'Joseph', 'Samuel', 'Carter', 'Owen', 'Wyatt', 'John', 'Jack',
            'Luke', 'Julian', 'Levi', 'Isaac', 'Anthony', 'Grayson', 'Joshua', 'Christopher', 'Andrew', 'Nathan'
        ]
        female_first_names = [
            'Sarah', 'Emily', 'Olivia', 'Emma', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia',
            'Harper', 'Evelyn', 'Abigail', 'Ella', 'Scarlett', 'Grace', 'Lily', 'Hannah', 'Aria', 'Chloe',
            'Penelope', 'Riley', 'Zoey', 'Nora', 'Lucy', 'Victoria', 'Madeline', 'Stella', 'Leah', 'Aurora'
        ]
        last_names = [
            'Smith', 'Brown', 'Williams', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas',
            'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
            'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green'
        ]

        profile_pics_male = [
            "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
            "https://t3.ftcdn.net/jpg/03/33/01/30/240_F_333013089_rLm76bpH8O4umraRShSLqLD667bPpvhW.jpg",
            "https://t3.ftcdn.net/jpg/08/44/38/58/240_F_844385865_TX6AWu9nFXwN9mA2yPvpeTHn8fbndhHq.jpg  ",
            "https://t3.ftcdn.net/jpg/05/26/60/52/240_F_526605284_O2zMSOvCx4VIGY2nQKlbavo3UW9w0oDF.jpg",
            "https://t4.ftcdn.net/jpg/10/50/84/95/240_F_1050849528_HMn1btjZvKZHZMc2gfLvSuwn7thAbeno.jpg ",
            "https://t4.ftcdn.net/jpg/02/54/77/97/240_F_254779767_ROEK4ANl9nl6J1fHhsjnQ8X62Znro9N5.jpg",
            "https://t4.ftcdn.net/jpg/03/56/33/75/240_F_356337517_lPKBgCGCHYHfmJCV7zlPbvqlf41j66xi.jpg",
            "https://t4.ftcdn.net/jpg/08/16/92/91/240_F_816929101_gy8vZBUXwLrfYpPazGWPyyi9la4BmRlf.jpg",
            "https://t4.ftcdn.net/jpg/04/98/99/45/240_F_498994507_BzNm5bADa9GbvxvlgRLFwrc4FetmBmqi.jpg",
            "https://t3.ftcdn.net/jpg/02/00/90/24/240_F_200902415_G4eZ9Ok3Ypd4SZZKjc8nqJyFVp1eOD6V.jpg",
            "https://t4.ftcdn.net/jpg/04/22/82/39/240_F_422823992_ZtyrE96o6wGTJcyZolZ6pLRUGHBRCH9c.jpg",
            "https://t3.ftcdn.net/jpg/02/22/85/16/240_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg",
            "https://t3.ftcdn.net/jpg/01/70/01/74/240_F_170017413_JHNYFqcpk0aHER9fdnEsETLKafT8rmb0.jpg",
            "https://t4.ftcdn.net/jpg/04/64/87/43/240_F_464874339_Rc7McGaz327ljzgnWgke4crdDAdI2Yu2.jpg",
            "https://t4.ftcdn.net/jpg/04/32/89/63/240_F_432896398_99o08tTgBYj8YP2eatvF4zaJu3AdF40E.jpg",
            "https://t4.ftcdn.net/jpg/02/59/16/27/240_F_259162782_NYDGmbwSM4RQcYC55YAPbVban4G0n5t1.jpg",
            "https://t3.ftcdn.net/jpg/02/83/12/96/240_F_283129653_iDQrlBEDpYWbKyDIUotS0Dy8ngUwQBaz.jpg",
            "https://t3.ftcdn.net/jpg/02/07/55/70/240_F_207557081_uh1w4xm9CGqjFLJgrQKYPm9kiASOCPqx.jpg",
            "https://t3.ftcdn.net/jpg/04/97/66/28/240_F_497662812_7rGW6PMBJR9AbrKcGgN5S1luXYTjH92i.jpg",
            "https://t4.ftcdn.net/jpg/01/82/22/03/240_F_182220324_QiTjkB3IPwx1zfNltFA4ww3dKQyYvVWB.jpg",
            "https://t4.ftcdn.net/jpg/03/58/96/39/240_F_358963988_b3FQwLD5wWOmETSvBvLBsBLBtW2z4yUW.jpghttps://t4.ftcdn.net/jpg/03/25/73/59/240_F_325735908_TkxHU7okor9CTWHBhkGfdRumONWfIDEb.jpg",
            "https://t4.ftcdn.net/jpg/03/86/67/53/240_F_386675348_DkbPRVtBEM55bi2wkGgeEDljzC94rjEu.jpg",
            "https://t3.ftcdn.net/jpg/03/91/34/72/240_F_391347204_XaDg0S7PtbzJRoeow3yWO1vK4pnqBVQY.jpg",
            "https://t4.ftcdn.net/jpg/03/64/21/11/240_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg",
            "https://t4.ftcdn.net/jpg/06/27/07/63/240_F_627076328_I08lO6C7wYCSjAODeOUyT2ZsyVROe6am.jpg",
            "https://t4.ftcdn.net/jpg/03/10/07/91/240_F_310079187_l8nBUkpNLpiJ0icGYLAcTbmkxwedmwLO.jpg",
            "https://t3.ftcdn.net/jpg/07/75/21/26/240_F_775212627_bymcLmHCTPZWAQsuZBMzra3oIEgJLJ36.jpg",
            "https://t4.ftcdn.net/jpg/03/14/14/45/240_F_314144513_p1hwYePWAvtCR2dD4AiSLJfvLvaxwRub.jpg"
            "https://t4.ftcdn.net/jpg/02/15/55/93/240_F_215559319_9gwwdzuLgUwt5nW0Tu2baATXQbceyx6y.jpg",
            "https://t4.ftcdn.net/jpg/01/95/65/17/240_F_195651759_479r5S6Rx77XBSLHJQY2qd2xiwiRGAxB.jpg",
            "https://t4.ftcdn.net/jpg/02/74/40/77/240_F_274407759_qu3T1jj0UAu9XtSNNB6xHhn7JKKcN2c3.jpg"
        ]
        profile_pics_female = [
            "https://t4.ftcdn.net/jpg/03/83/25/83/240_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
            "https://t3.ftcdn.net/jpg/02/43/76/54/240_F_243765470_a0hN5zuTKIonTbRGldi8KajuvhSiWvDx.jpg",
            "https://t3.ftcdn.net/jpg/02/30/40/74/240_F_230407433_uF2iM6tUs1Sge24999FWdo241t8FMBi7.jpg",
            "https://t4.ftcdn.net/jpg/03/13/37/31/240_F_313373132_b9Az7XaGLRvSLHXlINXBIGPMIOLok8ZB.jpg",
            "https://t4.ftcdn.net/jpg/01/51/99/39/240_F_151993994_mmAYzngmSbNRr6Fxma67Od3WHrSkfG5I.jpg",
            "https://t3.ftcdn.net/jpg/03/36/94/42/240_F_336944276_tpWzmwFi6JfZln5VlfBC1BZu5jgDOAl8.jpg",
            "https://t4.ftcdn.net/jpg/03/38/90/37/240_F_338903738_RT7vLyCCZeWWvKD42waga3xej2CGFnXW.jpg",
            "https://t3.ftcdn.net/jpg/03/29/43/72/240_F_329437299_hMz77tiEfQNBbxbX3kRi5HHj4XLlnL4K.jpg",
            "https://t3.ftcdn.net/jpg/05/43/81/34/240_F_543813442_xjCP4hC52tRTSVp52LSEWr4A12YNyS0l.jpg",
            "https://t3.ftcdn.net/jpg/03/22/36/32/240_F_322363271_hPT8kGlozwmhfGyA7O08Q7SIvCGUNBhv.jpg",
            "https://t3.ftcdn.net/jpg/05/22/14/24/240_F_522142457_na0JOOqIXgRMOrgjJItfshoaZlutd3fV.jpg",
            "https://t4.ftcdn.net/jpg/05/17/69/51/240_F_517695126_xVHlxMfMqZlBw1dtwgtiRKjunSjxX0wj.jpg",
            "https://t3.ftcdn.net/jpg/02/22/10/62/240_F_222106228_NP5f0gXi3JOCgmaTsEyg7RuyKgwDLGuY.jpg",
            "https://t4.ftcdn.net/jpg/01/70/01/71/240_F_170017144_y0Y9gnV3q55VNk7dnCRlK4LE1B3e9DFx.jpg",
            "https://t4.ftcdn.net/jpg/05/35/28/93/240_F_535289317_lrX9mbQwwRd4Bn3kvxL442XjtNJtZxjy.jpg",
            "https://t3.ftcdn.net/jpg/05/83/41/98/240_F_583419866_97XPxjHDJkQ2RKMmGWdgrbqJhEZeQb55.jpg",
            "https://t3.ftcdn.net/jpg/02/68/73/32/240_F_268733269_DAOUAU8ioiNKOqRC8PWwji2k5MJQfx1j.jpg",
            "https://t3.ftcdn.net/jpg/04/14/88/12/240_F_414881258_971wmhPNTLEwKUGXDPJy4Ql7pViomUOl.jpg",
            "https://t3.ftcdn.net/jpg/03/34/52/14/240_F_334521438_mmtaUtbWMXYCLCtXXNFnivH6wUH60JDc.jpg",
            "https://t3.ftcdn.net/jpg/07/37/28/54/240_F_737285469_LeX6IZBI4x7wt0VIKkHKVC2o5WfZ4vww.jpg",
            "https://t4.ftcdn.net/jpg/03/16/72/71/240_F_316727117_LWSUJQxKbgPz4ucNsucp7j3AzGrjJW7U.jpg",
            "https://t3.ftcdn.net/jpg/04/90/01/32/240_F_490013276_52jMVHNKvG6TJkaUi4Fsh2ICpXEhE3ZG.jpg",
            "https://t4.ftcdn.net/jpg/03/36/97/95/240_F_336979582_9YQipUAfPEfKF6gZ5EfzT5b8U3vWJsFJ.jpg",
            "https://t3.ftcdn.net/jpg/03/47/93/50/240_F_347935076_Oqu4VcxwQlh0LT6vrJzxVoxtI71HNmAc.jpg",
            "https://t3.ftcdn.net/jpg/03/15/07/04/240_F_315070495_eCR5IjbhVfflbx4TPVLrjROgTEfMzjVU.jpg",
            "https://t3.ftcdn.net/jpg/07/66/62/06/240_F_766620682_pRCdLBW8iq8mS84LWKtpBx4Xu26Cvkl5.jpg",
            "https://t3.ftcdn.net/jpg/03/55/74/14/240_F_355741445_3NYNN44EbPN7JF7LQQQW7fbhgSTYzNyt.jpg",
            "https://t3.ftcdn.net/jpg/05/39/16/60/240_F_539166003_yaH6Qx19KpHLbMpegfP7oTX2VFNsCoZk.jpg",
            "https://t4.ftcdn.net/jpg/05/50/81/29/240_F_550812955_gEsXs9EtB1CUxQD9Bnspgko8AHAwxp8f.jpg",
            "https://t3.ftcdn.net/jpg/05/13/74/48/240_F_513744811_ERHfVz9cR7pZe8mpvV7JknobjILKBGH7.jpg",
            "https://t3.ftcdn.net/jpg/05/28/52/94/240_F_528529413_Cjkpm5Ccyr4iwf75vGfOvI4vNJE4rXDu.jpg",
        ]

        experts_created = 0
        for service in services:
            # ✅ Strictly match experts to their relevant services
            matched_experts = Expert.query.filter(
                Expert.project_types.any(id=service.project_type_id),
                Expert.subjects.any(id=service.subject_id)
            ).all()
            
            existing_experts = (
                Expert.query
                .join(expert_services)
                .filter(expert_services.c.service_id == service.id)
                .count()
            )

            if existing_experts >= 3:
                logger.info(f"✅ Service '{service.title}' already has {existing_experts} experts.")
                continue

            num_to_assign = 3 - existing_experts
            assigned_experts = set()
            logger.info(f"🔹 Assigning {num_to_assign} experts to '{service.title}'")
            
            # ✅ First, try to use already matched experts
            for expert in matched_experts:
                if len(assigned_experts) >= num_to_assign:
                    break
                if expert not in assigned_experts and service not in expert.services:
                    expert.services.append(service)
                    db.session.commit()
                    assigned_experts.add(expert)
                    logger.info(f"✅ Assigned existing expert {expert.name} to '{service.title}'")

            # ✅ If not enough matched experts, create new ones
            while len(assigned_experts) < num_to_assign:
                is_male = choice([True, False])
                first_name = choice(male_first_names if is_male else female_first_names)
                last_name = choice(last_names)
                full_name = f"{first_name} {last_name}"

                # ✅ Create a new user for the expert
                new_user = User(
                    username=full_name,
                    is_admin=False
                )
                db.session.add(new_user)
                db.session.commit()

                # ✅ Create a new expert profile
                expert = Expert(
                    id=new_user.id,
                    name=full_name,
                    title=f"{service.title} Specialist",
                    expertise=f"Expert in {service.title}",
                    description=f"{full_name} specializes in {service.title}.",
                    biography="Highly skilled professional with years of experience.",
                    education="PhD in relevant field",
                    languages="English, French",
                    profile_picture="https://example.com/profile.jpg",
                )
                db.session.add(expert)
                db.session.commit()

                # ✅ Assign expert to the service
                expert.services.append(service)
                db.session.commit()
                assigned_experts.add(expert)

                logger.info(f"✅ Created expert: {full_name} for '{service.title}'")

        logger.info(f"✅ Successfully assigned experts to services!")
        return True

    except Exception as e:
        logger.error(f"❌ Error during expert generation: {str(e)}")
        db.session.rollback()
        return False

if __name__ == "__main__":
    with app.app_context():
        success = generate_experts()
        if not success:
            logger.error("Expert generation failed!")
