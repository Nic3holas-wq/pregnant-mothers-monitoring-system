import React from "react";
import Navigation from "../../Components/Navigation/Navigation";
import theme from "../../utils/theme";

const Insights = () => {
  return (
    <>
    {/* Navigation Bar */}
    <Navigation />
    <div className="container mt-5">
      

      {/* Page Header */}
      <div className="text-center my-4">

        <p className="text-muted">
          Learn more about pregnancy, health, and well-being from experts.
        </p>
      </div>

    {/* Featured Videos */}
    <div className="row row-cols-1 row-cols-md-3 g-4">
  {/* Video 1 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/KdHZEohDxzM"
        title="Essential Pregnancy Tips for Healthy Baby"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">Pregnancy Tips for a Healthy Baby</h5>
        <p className="card-text text-muted mt-auto">Watch expert advice on prenatal care.</p>
      </div>
    </div>
  </div>

  {/* Video 2 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/qQqIXvB50lk"
        title="10 Healthy Pregnancy TIPS | Self-Care, Digestion, Nutrition Habits"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">10 Healthy Pregnancy TIPS | Self-Care & Nutrition</h5>
        <p className="card-text text-muted mt-auto">Essential pregnancy guidelines for self-care and nutrition.</p>
      </div>
    </div>
  </div>

  {/* Video 3 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/E0i7NQsJdWY"
        title="First Trimester | 3D Animated Pregnancy Guide"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">First Trimester Pregnancy Tips</h5>
        <p className="card-text text-muted mt-auto">Learn what to expect and how to take care of yourself during the first trimester.</p>
      </div>
    </div>
  </div>

  {/* Video 4 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/jX2L20k6uTg"
        title="Everything You Need to Know About the First Trimester of Pregnancy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">First Trimester Pregnancy Tips</h5>
        <p className="card-text text-muted mt-auto">Everything You Need to Know About the First Trimester of Pregnancy.</p>
      </div>
    </div>
  </div>

  {/* Video 5 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/oq2QQB8fzFE"
        title="Second Trimester Pregnancy Symptoms | Leg Swelling, Back Pain, Bleeding Gums and More"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">Second Trimester Pregnancy Tips</h5>
        <p className="card-text text-muted mt-auto">Second Trimester Pregnancy Symptoms | Leg Swelling, Back Pain, Bleeding Gums and More.</p>
      </div>
    </div>
  </div>

  {/* Video 6 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/bBSLgWdX4Co"
        title="Pregnancy Must Haves | Second Trimester Pregnancy Essentials"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">Second Trimester Pregnancy Tips</h5>
        <p className="card-text text-muted mt-auto">Pregnancy Must Haves | Second Trimester Pregnancy Essentials.</p>
      </div>
    </div>
  </div>

  {/* Video 7 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/NHkdqG8_frA"
        title="How To Sleep During Pregnancy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">Pregnancy Sleeping Tips</h5>
        <p className="card-text text-muted mt-auto">How To Sleep During Pregnancy.</p>
      </div>
    </div>
  </div>

  {/* Video 8 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/AnmM2WaCLjE"
        title="WHAT I PACKED IN MY HOSPITAL BAG + BABY SUNSHINE’S HOSPITAL BAG"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">What to carry to hospital</h5>
        <p className="card-text text-muted mt-auto">WHAT I PACKED IN MY HOSPITAL BAG + BABY SUNSHINE’S HOSPITAL BAG.</p>
      </div>
    </div>
  </div>

  {/* Video 9 */}
  <div className="col">
    <div className="card shadow h-100 d-flex flex-column">
      <iframe 
        width="100%" 
        height="210"
        src="https://www.youtube.com/embed/3GTK6MLPJ9g"
        title="Top 10 Foods To Eat During Pregnancy (and why) + Pregnancy Diet Plan (From a Dietitian)"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-top"
      ></iframe>
      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">Healthy Food Tips</h5>
        <p className="card-text text-muted mt-auto">Top 10 Foods To Eat During Pregnancy (and why) + Pregnancy Diet Plan (From a Dietitian).</p>
      </div>
    </div>
  </div>
</div>

      {/* Pregnancy Information */}
      <div className="row mt-5">
        <div className="col-md-6">
          <img
            src="/background.jpg"
            alt="Pregnancy"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <h4 className="fw-bold">Understanding Pregnancy Stages</h4>
            <p className="text-muted">
              Pregnancy is divided into three trimesters, each bringing different changes to both the mother and baby. It's important to get regular checkups and maintain a healthy lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="mt-5 card shadow p-3 text-black" style={{background:"#D2B4D5"}}>
       <h3 className="fw-bold">Second Trimester Symptoms</h3>
       <p style={{lineHeight:"25px"}}>
       The second trimester is sometimes referred to as the honeymoon stage of pregnancy. It’s likely that many of the worst early symptoms, like morning sickness and extreme exhaustion, have started to fade, ushering in a phase of relative normalcy. Yes, you might actually start feeling like a human again soon! Of course, this isn’t always the case; some not-so-lucky pregnant people are dogged by pervasive unpleasantness that just won’t quit. Either way, you’ll probably also notice some additional or recurring symptoms in the second trimester, including:
       </p>

       <p className="fw-semibold h5">Heartburn</p>
       <p>Acid reflux and heartburn tend to kick into high gear some time in the second trimester, when the uterus comes out of the pelvis and becomes part of the abdomen. Hormones also relax the esophageal sphincter allowing acidity to creep back up, causing that signature burn. It doesn’t feel great, but there are over-the-counter medications and home remedies that can help. In the meantime, pace your eating and avoid trigger foods (we’re looking at you, spicy sauces and citrus fruits!).</p>
      
       <p className="fw-semibold h5">Stretch marks</p>
       <p>Your bump is burgeoning, and your body is rapidly changing. That means your skin is also getting pulled tight. Enter: stretch marks, the scars that form when the skin’s collagen and elastin fibers rupture. While they’re normal, common and totally harmless, you might not love the way they look. Keep in mind, though, that these battle scars are a visual reminder of the amazing things you can do. That said, you can try to take some proactive measures to prevent them before they appear—keeping your skin hydrated with stretch mark creams and oils may help.
       </p>

       <p className="fw-semibold h5">Linea nigra and other skin changes</p>
       <p>If you suddenly see a dark line appear down the center of your bump, don’t be alarmed. This is called the linea nigra. It’s one of many physical changes you may notice in the second or third trimester. 
       It happens when pregnancy hormones stimulate melanocytes, causing hyper pigmentation of the skin. In fact, this is not the only place you may find some darkened patches on your body. Melasma (aka the mask of pregnancy) is another common affliction in the second trimester. Rest assured, your new belly line and any other darkened spots will likely fade soon after delivery.</p>
      </div>

      <div className="mt-5 card shadow p-3 text-black" style={{background:"#D2B4D5"}}>
        <h3 className="fw-bold">Baby Development in the Second Trimester</h3>
        <p style={{lineHeight:"25px"}}>
        Baby develops by leaps and bounds during the second trimester. Their bones are hardening; lungs are developing and toenails, fingerprints and footprints begin forming. Limb movements become more coordinated, and soon those little flutters you’re feeling will turn into hearty kicks and impressive elbow jabs! Baby can suck their thumb (you might even get to see this on screen during the 20-week anatomy scan). Better yet, they can hear sounds around 16 weeks, so speak up—your little one loves listening to your sweet voice.       </p>
      
      <h4 className="fw-semibold">What to Avoid During the Second Trimester</h4>
      <p>The things you avoided in the first trimester are more or less the same things you’ll avoid throughout the remainder of your journey.</p>

      <p className="fw-semibold h5">Raw or undercooked fish</p>
       <p>Raw or undercooked fish can contain parasites and bacteria like salmonella or listeria, which can be very dangerous to you and baby, says Meleen Chuang, MD, chief of service in Obstetrics and Gynecology at NYU Langone Hospital Brooklyn. Instead, you can cook and enjoy fresh fish. “Wait till after you have baby to have a sushi celebration,” she advises.</p>
      
       <p className="fw-semibold h5">Deli meat</p>
       <p>If you’re going to have deli meat while pregnant, make sure you cook or heat it up thoroughly before eating to avoid the risk of listeria, says Chuang. Heat your meat to at least 165 degrees, says Theresa Mahon, MD, FACOG, an ob-gyn hospitalist at Stamford Health in Connecticut. You’ll also want to skip deli-made salads made with mayo, such as potato and egg salads, since those are prepared and eaten cold. “We’re not sure how long it’s been sitting out for before purchase,” Chuang says.</p>

       <p className="fw-semibold h5">Unpasteurized foods and drinks</p>
       <p>Be sure to avoid soft cheeses such as queso fresco since they can contain listeria and other bacteria, says Mahon. “Rule of thumb: In pregnancy, avoid unpasteurized food and unpasteurized liquids like raw milk and unpasteurized juices,” she adds.
       </p>


       <p className="fw-semibold h5">Unwashed produce</p>
       <p>It’s a good idea to eat lots of fruits and vegetables in pregnancy (and always!), but you need to make sure to wash them thoroughly, says Donna Adams-Pickett, PhD, MD, an ob-gyn at Augusta Women’s Health and Wellness Center in Georgia.
       </p>

       <p className="fw-semibold h5">High-mercury fish</p>
       <p>Mahon says that seafood with high mercury levels can affect baby’s brain development. “The bigger the fish, the greater the mercury content—so avoid king mackerel, marlin, orange roughy, swordfish, bigeye tuna [and] shark,” says Mahon. Salmon, cod, tilapia and lobster are all safe as long as they’re cooked thoroughly, she says.
       </p>

       <p className="fw-semibold h5">Alcohol</p>
       <div className="d-flex flex-row gap-3 align-items-center">
       <img src="/alcohol.jpg" alt="woman drinking alcohol" className="rounded-circle w-25" width={150} height={200}/>
       
       <p className="w-75"> You might not raise a glass to this: There’s no known safe level of alcohol consumption during pregnancy, according to the American College of Obstetricians and Gynecologists (ACOG). Alcohol can cause congenital abnormalities and developmental issues in baby and lead to fetal alcohol spectrum disorders (FASD), says Bonnie Zell, MD, MPH, FACOG, chief medical officer at Delfina, an AI-centered solution to maternal care. FASD can involve learning disabilities, behavioral problems and physical abnormalities like small head size and poor vision and hearing, says Chuang. So, switch to mocktails and toast with the real thing after you give birth.
       </p>
       </div>

       <p className="fw-semibold h5">Smoking and Vaping</p>
       <div className="d-flex flex-row gap-3 align-items-center">
        <img src="/smoking.jpg" alt="woman smoking" className="rounded-circle w-25" width={150} height={200}/>
        <p className="w-75">Smoking cigarettes and cigars or vaping can cause low birth weight and serious complications like placental abruption, says Mahon. “Children of pregnant people who smoke are at high risk of childhood asthma,” she says. Even if you don’t light up or vape yourself, try to avoid secondhand smoke as well, since it can also lead to issues, she adds.
       </p>

       </div>
       <p>Smoking cigarettes and cigars or vaping can cause low birth weight and serious complications like placental abruption, says Mahon. “Children of pregnant people who smoke are at high risk of childhood asthma,” she says. Even if you don’t light up or vape yourself, try to avoid secondhand smoke as well, since it can also lead to issues, she adds.
       </p>

       <p className="fw-semibold h5">Marijuana</p>
       <p>“Marijuana has 500 different chemicals that can pass through the placenta and affect baby,” Chuang explains. The potential side effects are serious: Fetal growth restriction, a higher risk of stillbirth, poor brain development and more. Other recreational substances need to be off the table too. Illicit drugs can increase risk of birth defects, says Chuang. “Opioid use disorder and intravenous drug abuse also increases the risk of severe infections such as HIV, hepatitis C and hepatitis B,” she adds.
       </p>

       <p className="fw-semibold h5">Certain Drugs and Supplements</p>
       <p>While some over-the-counter medications are safe for pregnancy, many others can pose risks. See your healthcare provider as soon as you learn you’re expecting, advises Nina Farzin, PharmD, CEO and founder of oogiebear, a gentle solution for cleaning baby ears and noses. During this appointment, tell them everything you’re taking, including prescription and over-the-counter medicines, supplements, herbal remedies and teas and vitamins. If necessary, they’ll help you find suitable swaps. In general, avoid drugs and supplements your provider doesn’t prescribe or approve for use during your pregnancy, adds Zell.
       </p>

       <p className="fw-semibold h5">Certain (Extreme) Exercises</p>
       <p>During the first trimester, you can generally stick to your typical exercise routine, says Adams-Pickett. But as your pregnancy progresses, your ligaments will begin to loosen, making you more prone to injuries and falls, she says. “As pregnancy advances, you may need to modify your routine because of discomfort and also because your center of gravity changes—and falls are a risk,” says Mahon. Here are a few types of pregnancy workouts to avoid, according to experts.
       </p>

       <p className="fw-semibold h5">Certain Skin-Care Ingredients</p>
       <p>It’s important to avoid certain skin-care products during pregnancy due to their potential effect on baby. For example, retinoids, often used for acne treatment, have been linked to birth defects. ACOG advises pregnant women to avoid products with phthalates, parabens, oxybenzone and triclosan, and to look for products marked “fragrance-free” rather than “unscented.”
       </p>
      </div>

      <div className="mt-5 card shadow p-3 text-black" style={{background:"#D2B4D5"}}>
      <h3 className="fw-bold">Third Trimester</h3>
      <p className="fw-semibold h5">Third Trimester Symptoms</p>
       <p>The finish line is nearing—baby will be in your arms before you know it! But first: a few fun surprises. Yes, the third trimester is chock full of unexpected new symptoms (oh joy!). Rest assured, though, that these slightly unpleasant developments are getting you closer to delivery day.
       </p>

       <p className="fw-semibold h5">Braxton Hicks contractions</p>
       <p>Before you experience real labor contractions, you may get some practice in the form of Braxton Hicks. These irregular contractions can start some time in the second or third trimester, and help to tone the muscles of your uterus and prepare your cervix for birth.
       </p>

       <p className="fw-semibold h5">Lightening</p>
       <p>If a friend comments that you’re suddenly carrying lower, you may have experienced lightening or “dropping” in late pregnancy. This is when baby drops into the lower pelvis in preparation for delivery. Not only will your bump look lower, you may feel lighter too. You might even find it easier to breathe and eat now that baby isn’t all up in your ribs! That said, you’ll probably have to pee more often, as baby presses down on your bladder.
       </p>

       <p className="fw-semibold h5">Lightning crotch</p>
       <p>Toward the end of pregnancy, you might experience random jolts or zaps of pain in your crotch region. Lightning crotch is normal, common and completely harmless, but it may catch you off guard. The good news: It doesn’t last long. It’s a momentary discomfort, and changing positions should help.
       </p>

       <p className="fw-bold h3">Baby Development in the Third Trimester</p>
       <p>Baby is getting bigger and their body begins to fill out a bit with a layer of brown fat. Meanwhile, their organs continue to mature, especially the lungs which helps them with their practice breathing. Baby’s reflexes are developing, and their five senses become largely functional (they love the sound of your voice!). Their bones continue to harden and their cartilage gets firmer. Around 37 weeks, meconium (aka baby’s first poop) begins to form. Suffice it to say, a lot is happening behind the scenes to get baby ready for their big debut.</p>
      
      <p className="fw-semibold h4">What to Avoid During the Third Trimester</p>
      <p>Generally speaking, you’ll want to avoid the same things in the third trimester that you’ve been steering clear of all along. That means no alcohol, smoking or illicit drug use. You’ll want to continue staying away from unpasteurized cheeses and juices, deli meats, raw fish and a few other risky foods. 
Avoid overly strenuous physical work and exercise, and any activity that raises your core body temperature (no dips in the hot tub). You also continue to get a free pass from changing the cat litter for a while. 
Finally, talk to your doctor or midwife before traveling in the third trimester. If things are progressing as expected, your provider may give you the green light to hop on a flight up until 34 to 36 weeks; just keep in mind that some airlines have their own policy regarding third-trimester air travel.
</p>

      <p className="fw-semibold h4">When to Reach Out to Your Doctor in the Third Trimester</p>
      <p>Undoubtedly, the third trimester will be uncomfortable. Aches and pains are par for the course, but there are a few red flags to watch for. If abdominal pain is severe and unrelenting, if you have regular contractions before 37 weeks or experience significant vaginal bleeding or leaking of fluid, contact your doctor right away; these may indicate preterm labor. Also reach out if you are experiencing blurred vision, headaches and swelling, as these symptoms could indicate preeclampsia, a complication typically marked by high blood pressure. Finally, seek medical attention if you notice a major reduction in baby’s movement (less than 10 kicks in two hours) when doing kick counts.</p>
      </div>
    </div>
    </>
    
  );
};

export default Insights;
