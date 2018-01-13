import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

import { VendorsService } from 'app/services';
import { RegEx } from './../../../regular-expressions';
import { VendorDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
    selector: 'app-add-vendor',
    templateUrl: './add-vendor.component.html',
    styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

    vendorId: any;
    addVendorForm: FormGroup;
    public config = {
        uiColor: '#F0F3F4',
        height: '200'
    };
    showLoader = false;
    bigLoader = false;
    vendors: any;
    vendorInfo: any;
    citiesList = ["Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Gandhinagar", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Patna", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Vadodara", "Firozabad", "Ludhiana", "Rajkot", "Agra", "Siliguri", "Nashik", "Faridabad", "Patiala", "Meerut", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Dhanbad", "Jodhpur", "Amritsar", "Raipur", "Allahabad", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Madurai", "Guwahati", "Chandigarh", "Hubli-Dharwad", "Amroha", "Moradabad", "Gurgaon", "Aligarh", "Solapur", "Ranchi", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal", "Mira-Bhayandar", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur", "Bhilai Nagar", "Cuttack", "Kochi", "Udaipur", "Bhavnagar", "Dehradun", "Asansol", "Nanded-Waghala", "Ajmer", "Jamnagar", "Ujjain", "Sangli", "Loni", "Jhansi", "Pondicherry", "Nellore", "Jammu", "Belagavi", "Raurkela", "Mangaluru", "Tirunelveli", "Malegaon", "Gaya", "Tiruppur", "Davanagere", "Kozhikode", "Akola", "Kurnool", "Bokaro Steel City", "Rajahmundry", "Ballari", "Agartala", "Bhagalpur", "Latur", "Dhule", "Korba", "Bhilwara", "Brahmapur", "Mysore", "Muzaffarpur", "Ahmednagar", "Kollam", "Raghunathganj", "Bilaspur", "Shahjahanpur", "Thrissur", "Alwar", "Kakinada", "Nizamabad", "Sagar", "Tumkur", "Hisar", "Rohtak", "Panipat", "Darbhanga", "Kharagpur", "Aizawl", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Rampur", "Shivamogga", "Ratlam", "Modinagar", "Durg", "Shillong", "Imphal", "Hapur", "Ranipet", "Anantapur", "Arrah", "Karimnagar", "Parbhani", "Etawah", "Bharatpur", "Begusarai", "New Delhi", "Chhapra", "Kadapa", "Ramagundam", "Pali", "Satna", "Vizianagaram", "Katihar", "Hardwar", "Sonipat", "Nagercoil", "Thanjavur", "Murwara (Katni)", "Naihati", "Sambhal", "Nadiad", "Yamunanagar", "English Bazar", "Eluru", "Munger", "Panchkula", "Raayachuru", "Panvel", "Deoghar", "Ongole", "Nandyal", "Morena", "Bhiwani", "Porbandar", "Palakkad", "Anand", "Purnia", "Baharampur", "Barmer", "Morvi", "Orai", "Bahraich", "Sikar", "Vellore", "Singrauli", "Khammam", "Mahesana", "Silchar", "Sambalpur", "Rewa", "Unnao", "Hugli-Chinsurah", "Raiganj", "Phusro", "Adityapur", "Alappuzha", "Bahadurgarh", "Machilipatnam", "Rae Bareli", "Jalpaiguri", "Bharuch", "Pathankot", "Hoshiarpur", "Baramula", "Adoni", "Jind", "Tonk", "Tenali", "Kancheepuram", "Vapi", "Sirsa", "Navsari", "Mahbubnagar", "Puri", "Robertson Pet", "Erode", "Batala", "Haldwani-cum-Kathgodam", "Vidisha", "Saharsa", "Thanesar", "Chittoor", "Veraval", "Lakhimpur", "Sitapur", "Hindupur", "Santipur", "Balurghat", "Ganjbasoda", "Moga", "Proddatur", "Srinagar", "Medinipur", "Habra", "Sasaram", "Hajipur", "Bhuj", "Shivpuri", "Ranaghat", "Shimla", "Tiruvannamalai", "Kaithal", "Rajnandgaon", "Godhra", "Hazaribag", "Bhimavaram", "Mandsaur", "Dibrugarh", "Kolar", "Bankura", "Mandya", "Dehri-on-Sone", "Madanapalle", "Malerkotla", "Lalitpur", "Bettiah", "Pollachi", "Khanna", "Neemuch", "Palwal", "Palanpur", "Guntakal", "Nabadwip", "Udupi", "Jagdalpur", "Motihari", "Pilibhit", "Dimapur", "Mohali", "Sadulpur", "Rajapalayam", "Dharmavaram", "Kashipur", "Sivakasi", "Darjiling", "Chikkamagaluru", "Gudivada", "Baleshwar Town", "Mancherial", "Srikakulam", "Adilabad", "Yavatmal", "Barnala", "Nagaon", "Narasaraopet", "Raigarh", "Roorkee", "Valsad", "Ambikapur", "Giridih", "Chandausi", "Purulia", "Patan", "Bagaha", "Hardoi ", "Achalpur", "Osmanabad", "Deesa", "Nandurbar", "Azamgarh", "Ramgarh", "Firozpur", "Baripada Town", "Karwar", "Siwan", "Rajampet", "Pudukkottai", "Anantnag", "Tadpatri", "Satara", "Bhadrak", "Kishanganj", "Suryapet", "Wardha", "Ranebennuru", "Amreli", "Neyveli (TS)", "Jamalpur", "Marmagao", "Udgir", "Tadepalligudem", "Nagapattinam", "Buxar", "Aurangabad", "Jehanabad", "Phagwara", "Khair", "Sawai Madhopur", "Kapurthala", "Chilakaluripet", "Aurangabad", "Malappuram", "Rewari", "Nagaur", "Sultanpur", "Nagda", "Port Blair", "Lakhisarai", "Panaji", "Tinsukia", "Itarsi", "Kohima", "Balangir", "Nawada", "Jharsuguda", "Jagtial", "Viluppuram", "Amalner", "Zirakpur", "Tanda", "Tiruchengode", "Nagina", "Yemmiganur", "Vaniyambadi", "Sarni", "Theni Allinagaram", "Margao", "Akot", "Sehore", "Mhow Cantonment", "Kot Kapura", "Makrana", "Pandharpur", "Miryalaguda", "Shamli", "Seoni", "Ranibennur", "Kadiri", "Shrirampur", "Rudrapur", "Parli", "Najibabad", "Nirmal", "Udhagamandalam", "Shikohabad", "Jhumri Tilaiya", "Aruppukkottai", "Ponnani", "Jamui", "Sitamarhi", "Chirala", "Anjar", "Karaikal", "Hansi", "Anakapalle", "Mahasamund", "Faridkot", "Saunda", "Dhoraji", "Paramakudi", "Balaghat", "Sujangarh", "Khambhat", "Muktsar", "Rajpura", "Kavali", "Dhamtari", "Ashok Nagar", "Sardarshahar", "Mahuva", "Bargarh", "Kamareddy", "Sahibganj", "Kothagudem", "Ramanagaram", "Gokak", "Tikamgarh", "Araria", "Rishikesh", "Shahdol", "Medininagar (Daltonganj)", "Arakkonam", "Washim", "Sangrur", "Bodhan", "Fazilka", "Palacole", "Keshod", "Sullurpeta", "Wadhwan", "Gurdaspur", "Vatakara", "Tura", "Narnaul", "Kharar", "Yadgir", "Ambejogai", "Ankleshwar", "Savarkundla", "Paradip", "Virudhachalam", "Kanhangad", "Kadi", "Srivilliputhur", "Gobindgarh", "Tindivanam", "Mansa", "Taliparamba", "Manmad", "Tanuku", "Rayachoti", "Virudhunagar", "Koyilandy", "Jorhat", "Karur", "Valparai", "Srikalahasti", "Neyyattinkara", "Bapatla", "Fatehabad", "Malout", "Sankarankovil", "Tenkasi", "Ratnagiri", "Rabkavi Banhatti", "Sikandrabad", "Chaibasa", "Chirmiri", "Palwancha", "Bhawanipatna", "Kayamkulam", "Pithampur", "Nabha", "Shahabad, Hardoi", "Dhenkanal", "Uran Islampur", "Gopalganj", "Bongaigaon City", "Palani", "Pusad", "Sopore", "Pilkhuwa", "Tarn Taran", "Renukoot", "Mandamarri", "Shahabad", "Barbil", "Koratla", "Madhubani", "Arambagh", "Gohana", "Ladnu", "Pattukkottai", "Sirsi", "Sircilla", "Tamluk", "Jagraon", "AlipurdUrban Agglomerationr", "Alirajpur", "Tandur", "Naidupet", "Tirupathur", "Tohana", "Ratangarh", "Dhubri", "Masaurhi", "Visnagar", "Vrindavan", "Nokha", "Nagari", "Narwana", "Ramanathapuram", "Ujhani", "Samastipur", "Laharpur", "Sangamner", "Nimbahera", "Siddipet", "Suri", "Diphu", "Jhargram", "Shirpur-Warwade", "Tilhar", "Sindhnur", "Udumalaipettai", "Malkapur", "Wanaparthy", "Gudur", "Kendujhar", "Mandla", "Mandi", "Nedumangad", "North Lakhimpur", "Vinukonda", "Tiptur", "Gobichettipalayam", "Sunabeda", "Wani", "Upleta", "Narasapuram", "Nuzvid", "Tezpur", "Una", "Markapur", "Sheopur", "Thiruvarur", "Sidhpur", "Sahaswan", "Suratgarh", "Shajapur", "Rayagada", "Lonavla", "Ponnur", "Kagaznagar", "Gadwal", "Bhatapara", "Kandukur", "Sangareddy", "Unjha", "Lunglei", "Karimganj", "Kannur", "Bobbili", "Mokameh", "Talegaon Dabhade", "Anjangaon", "Mangrol", "Sunam", "Gangarampur", "Thiruvallur", "Tirur", "Rath", "Jatani", "Viramgam", "Rajsamand", "Yanam", "Kottayam", "Panruti", "Dhuri", "Namakkal", "Kasaragod", "Modasa", "Rayadurg", "Supaul", "Kunnamkulam", "Umred", "Bellampalle", "Sibsagar", "Mandi Dabwali", "Ottappalam", "Dumraon", "Samalkot", "Jaggaiahpet", "Goalpara", "Tuni", "Lachhmangarh", "Bhongir", "Amalapuram", "Firozpur Cantt.", "Vikarabad", "Thiruvalla", "Sherkot", "Palghar", "Shegaon", "Jangaon", "Bheemunipatnam", "Panna", "Thodupuzha", "KathUrban Agglomeration", "Palitana", "Arwal", "Venkatagiri", "Kalpi", "Rajgarh (Churu)", "Sattenapalle", "Arsikere", "Ozar", "Thirumangalam", "Petlad", "Nasirabad", "Phaltan", "Rampurhat", "Nanjangud", "Forbesganj", "Tundla", "BhabUrban Agglomeration", "Sagara", "Pithapuram", "Sira", "Bhadrachalam", "Charkhi Dadri", "Chatra", "Palasa Kasibugga", "Nohar", "Yevla", "Sirhind Fatehgarh Sahib", "Bhainsa", "Parvathipuram", "Shahade", "Chalakudy", "Narkatiaganj", "Kapadvanj", "Macherla", "Raghogarh-Vijaypur", "Rupnagar", "Naugachhia", "Sendhwa", "Byasanagar", "Sandila", "Gooty", "Salur", "Nanpara", "Sardhana", "Vita", "Gumia", "Puttur", "Jalandhar Cantt.", "Nehtaur", "Changanassery", "Mandapeta", "Dumka", "Seohara", "Umarkhed", "Madhupur", "Vikramasingapuram", "Punalur", "Kendrapara", "Sihor", "Nellikuppam", "Samana", "Warora", "Nilambur", "Rasipuram", "Ramnagar", "Jammalamadugu", "Nawanshahr", "Thoubal", "Athni", "Cherthala", "Sidhi", "Farooqnagar", "Peddapuram", "Chirkunda", "Pachora", "Madhepura", "Pithoragarh", "Tumsar", "Phalodi", "Tiruttani", "Rampura Phul", "Perinthalmanna", "Padrauna", "Pipariya", "Dalli-Rajhara", "Punganur", "Mattannur", "Mathura", "Thakurdwara", "Nandivaram-Guduvancheri", "Mulbagal", "Manjlegaon", "Wankaner", "Sillod", "Nidadavole", "Surapura", "Rajagangapur", "Sheikhpura", "Parlakhemundi", "Kalimpong", "Siruguppa", "Arvi", "Limbdi", "Barpeta", "Manglaur", "Repalle", "Mudhol", "Shujalpur", "Mandvi", "Thangadh", "Sironj", "Nandura", "Shoranur", "Nathdwara", "Periyakulam", "Sultanganj", "Medak", "Narayanpet", "Raxaul Bazar", "Rajauri", "Pernampattu", "Nainital", "Ramachandrapuram", "Vaijapur", "Nangal", "Sidlaghatta", "Punch", "Pandhurna", "Wadgaon Road", "Talcher", "Varkala", "Pilani", "Nowgong", "Naila Janjgir", "Mapusa", "Vellakoil", "Merta City", "Sivaganga", "Mandideep", "Sailu", "Vyara", "Kovvur", "Vadalur", "Nawabganj", "Padra", "Sainthia", "Siana", "Shahpur", "Sojat", "Noorpur", "Paravoor", "Murtijapur", "Ramnagar", "Sundargarh", "Taki", "Saundatti-Yellamma", "Pathanamthitta", "Wadi", "Rameshwaram", "Tasgaon", "Sikandra Rao", "Sihora", "Tiruvethipuram", "Tiruvuru", "Mehkar", "Peringathur", "Perambalur", "Manvi", "Zunheboto", "Mahnar Bazar", "Attingal", "Shahbad", "Puranpur", "Nelamangala", "Nakodar", "Lunawada", "Murshidabad", "Mahe", "Lanka", "Rudauli", "Tuensang", "Lakshmeshwar", "Zira", "Yawal", "Thana Bhawan", "Ramdurg", "Pulgaon", "Sadasivpet", "Nargund", "Neem-Ka-Thana", "Memari", "Nilanga", "Naharlagun", "Pakaur", "Wai", "Tarikere", "Malavalli", "Raisen", "Lahar", "Uravakonda", "Savanur", "Sirohi", "Udhampur", "Umarga", "Pratapgarh", "Lingsugur", "Usilampatti", "Palia Kalan", "Wokha", "Rajpipla", "Vijayapura", "Rawatbhata", "Sangaria", "Paithan", "Rahuri", "Patti", "Zaidpur", "Lalsot", "Maihar", "Vedaranyam", "Nawapur", "Solan", "Vapi", "Sanawad", "Warisaliganj", "Revelganj", "Sabalgarh", "Tuljapur", "Simdega", "Musabani", "Kodungallur", "Phulabani", "Umreth", "Narsipatnam", "Nautanwa", "Rajgir", "Yellandu", "Sathyamangalam", "Pilibanga", "Morshi", "Pehowa", "Sonepur", "Pappinisseri", "Zamania", "Mihijam", "Purna", "Puliyankudi", "Shikarpur, Bulandshahr", "Umaria", "Porsa", "Naugawan Sadat", "Fatehpur Sikri", "Manuguru", "Udaipur", "Pipar City", "Pattamundai", "Nanjikottai", "Taranagar", "Yerraguntla", "Satana", "Sherghati", "Sankeshwara", "Madikeri", "Thuraiyur", "Sanand", "Rajula", "Kyathampalle", "Shahabad, Rampur", "Tilda Newra", "Narsinghgarh", "Chittur-Thathamangalam", "Malaj Khand", "Sarangpur", "Robertsganj", "Sirkali", "Radhanpur", "Tiruchendur", "Utraula", "Patratu", "Vijainagar, Ajmer", "Periyasemur", "Pathri", "Sadabad", "Talikota", "Sinnar", "Mungeli", "Sedam", "Shikaripur", "Sumerpur", "Sattur", "Sugauli", "Lumding", "Vandavasi", "Titlagarh", "Uchgaon", "Mokokchung", "Paschim Punropara", "Sagwara", "Ramganj Mandi", "Tarakeswar", "Mahalingapura", "Dharmanagar", "Mahemdabad", "Manendragarh", "Uran", "Tharamangalam", "Tirukkoyilur", "Pen", "Makhdumpur", "Maner", "Oddanchatram", "Palladam", "Mundi", "Nabarangapur", "Mudalagi", "Samalkha", "Nepanagar", "Karjat", "Ranavav", "Pedana", "Pinjore", "Lakheri", "Pasan", "Puttur", "Vadakkuvalliyur", "Tirukalukundram", "Mahidpur", "Mussoorie", "Muvattupuzha", "Rasra", "Udaipurwati", "Manwath", "Adoor", "Uthamapalayam", "Partur", "Nahan", "Ladwa", "Mankachar", "Nongstoin", "Losal", "Sri Madhopur", "Ramngarh", "Mavelikkara", "Rawatsar", "Rajakhera", "Lar", "Lal Gopalganj Nindaura", "Muddebihal", "Sirsaganj", "Shahpura", "Surandai", "Sangole", "Pavagada", "Tharad", "Mansa", "Umbergaon", "Mavoor", "Nalbari", "Talaja", "Malur", "Mangrulpir", "Soro", "Shahpura", "Vadnagar", "Raisinghnagar", "Sindhagi", "Sanduru", "Sohna", "Manavadar", "Pihani", "Safidon", "Risod", "Rosera", "Sankari", "Malpura", "Sonamukhi", "Shamsabad, Agra", "Nokha", "PandUrban Agglomeration", "Mainaguri", "Afzalpur", "Shirur", "Salaya", "Shenkottai", "Pratapgarh", "Vadipatti", "Nagarkurnool", "Savner", "Sasvad", "Rudrapur", "Soron", "Sholingur", "Pandharkaoda", "Perumbavoor", "Maddur", "Nadbai", "Talode", "Shrigonda", "Madhugiri", "Tekkalakote", "Seoni-Malwa", "Shirdi", "SUrban Agglomerationr", "Terdal", "Raver", "Tirupathur", "Taraori", "Mukhed", "Manachanallur", "Rehli", "Sanchore", "Rajura", "Piro", "Mudabidri", "Vadgaon Kasba", "Nagar", "Vijapur", "Viswanatham", "Polur", "Panagudi", "Manawar", "Tehri", "Samdhan", "Pardi", "Rahatgarh", "Panagar", "Uthiramerur", "Tirora", "Rangia", "Sahjanwa", "Wara Seoni", "Magadi", "Rajgarh (Alwar)", "Rafiganj", "Tarana", "Rampur Maniharan", "Sheoganj", "Raikot", "Pauri", "Sumerpur", "Navalgund", "Shahganj", "Marhaura", "Tulsipur", "Sadri", "Thiruthuraipoondi", "Shiggaon", "Pallapatti", "Mahendragarh", "Sausar", "Ponneri", "Mahad", "Lohardaga", "Tirwaganj", "Margherita", "Sundarnagar", "Rajgarh", "Mangaldoi", "Renigunta", "Longowal", "Ratia", "Lalgudi", "Shrirangapattana", "Niwari", "Natham", "Unnamalaikadai", "PurqUrban Agglomerationzi", "Shamsabad, Farrukhabad", "Mirganj", "Todaraisingh", "Warhapur", "Rajam", "Urmar Tanda", "Lonar", "Powayan", "P.N.Patti", "Palampur", "Srisailam Project (Right Flank Colony) Township", "Sindagi", "Sandi", "Vaikom", "Malda", "Tharangambadi", "Sakaleshapura", "Lalganj", "Malkangiri", "Rapar", "Mauganj", "Todabhim", "Srinivaspur", "Murliganj", "Reengus", "Sawantwadi", "Tittakudi", "Lilong", "Rajaldesar", "Pathardi", "Achhnera", "Pacode", "Naraura", "Nakur", "Palai", "Morinda, India", "Manasa", "Nainpur", "Sahaspur", "Pauni", "Prithvipur", "Ramtek", "Silapathar", "Songadh", "Safipur", "Sohagpur", "Mul", "Sadulshahar", "Phillaur", "Sambhar", "Prantij", "Nagla", "Pattran", "Mount Abu", "Reoti", "Tenu dam-cum-Kathhara", "Panchla", "Sitarganj", "Pasighat", "Motipur", "O' Valley", "Raghunathpur", "Suriyampalayam", "Qadian", "Rairangpur", "Silvassa", "Nowrozabad (Khodargama)", "Mangrol", "Soyagaon", "Sujanpur", "Manihari", "Sikanderpur", "Mangalvedhe", "Phulera", "Ron", "Sholavandan", "Saidpur", "Shamgarh", "Thammampatti", "Maharajpur", "Multai", "Mukerian", "Sirsi", "Purwa", "Sheohar", "Namagiripettai", "Parasi", "Lathi", "Lalganj", "Narkhed", "Mathabhanga", "Shendurjana", "Peravurani", "Mariani", "Phulpur", "Rania", "Pali", "Pachore", "Parangipettai", "Pudupattinam", "Panniyannur", "Maharajganj", "Rau", "Monoharpur", "Mandawa", "Marigaon", "Pallikonda", "Pindwara", "Shishgarh", "Patur", "Mayang Imphal", "Mhowgaon", "Guruvayoor", "Mhaswad", "Sahawar", "Sivagiri", "Mundargi", "Punjaipugalur", "Kailasahar", "Samthar", "Sakti", "Sadalagi", "Silao", "Mandalgarh", "Loha", "Pukhrayan", "Padmanabhapuram", "Belonia", "Saiha", "Srirampore", "Talwara", "Puthuppally", "Khowai", "Vijaypur", "Takhatgarh", "Thirupuvanam", "Adra", "Piriyapatna", "Obra", "Adalaj", "Nandgaon", "Barh", "Chhapra", "Panamattom", "Niwai", "Bageshwar", "Tarbha", "Adyar", "Narsinghgarh", "Warud", "Asarganj", "Sarsod"];

    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private _location: Location,
        private vendorsService: VendorsService,
        private toastr: ToastsManager,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe(params =>
            this.vendorId = params['vendorId']
        )
    }

    ngOnInit() {
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
        this.createForm();
        // this.getAllVendors();
        if (this.vendorId) {
            this.getVendorInfoForEdit();
        }
    }

    createForm() {
        this.addVendorForm = this.fb.group({
            'SellerId': [''],
            'UserId': ['12345'],
            'FirstName': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(20)
                ])
            ],
            'LastName': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(20)
                ])
            ],
            "SellerCode": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(20)
                ])
            ],
            "Company": [''],
            'EmailAddress': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.Email)
                ])
            ],
            "ContactNumber": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.phoneNumber)
                ])
            ],
            "AltContactNumber": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.phoneNumber)
                ])
            ],
            "Website": [
                '',
                Validators.compose([
                    Validators.pattern(RegEx.websiteUrl)
                ])
            ],
            "ListingFee": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.onlyNumber)
                ])
            ],
            "Address": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            "CityId": [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            //   "state": [
            //     '',
            //     Validators.compose([
            //       Validators.required
            //     ])
            //   ],
            //   "country": [
            //     '',
            //     Validators.compose([
            //       Validators.required
            //     ])
            //   ],
            "ZipCode": [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(RegEx.zipCode)
                ])
            ],
            'IsActive': [
                'TRUE',
                Validators.compose([
                    Validators.required
                ])
            ],
            'CreatedBy': ['Yogesh']
        });
    }

    getAllVendors() {
        // this.vendors = this.vendorsService.getVendors();
    }

    validatenumber(e) {
        if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
            e.preventDefault();
        }
    }

    addVendor(addVendorForm) {
        this.showLoader = true;
        if (addVendorForm.SellerId) {
            this.vendorsService.updateVendor(addVendorForm)
                .then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.toastr.success('Sucessfully Updated Seller Info!', 'Sucess!');
                        this.showLoader = false;
                        this._location.back();
                    } else if (success.Code === 500) {
                        this.toastr.error('Could not update seller!', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                })
        } else {
            delete addVendorForm.SellerId;
            this.vendorsService.addVendor(addVendorForm)
                .then((success) => {
                    console.log("success ", success);
                    if (success.Code === 200) {
                        this.toastr.success('Sucessfully Added Seller Info!', 'Sucess!');
                        this.showLoader = false;
                        this._location.back();
                    } else if (success.Code === 500) {
                        this.toastr.error('Could not add seller!', 'Error!');
                        this.showLoader = false;
                    }
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    getVendorInfoForEdit() {
        this.bigLoader = true;
        if (this.vendorId) {
            this.vendorsService.getVendors(this.vendorId).
                then((vendor) => {
                    this.vendorInfo = vendor.Data;
                    console.log("this.vendorInfo ", this.vendorInfo);
                    this.addVendorForm.controls['SellerId'].setValue(this.vendorInfo.SellerId);
                    this.addVendorForm.controls['FirstName'].setValue(this.vendorInfo.FirstName);
                    this.addVendorForm.controls['LastName'].setValue(this.vendorInfo.LastName);
                    this.addVendorForm.controls['SellerCode'].setValue(this.vendorInfo.SellerCode);
                    this.addVendorForm.controls['Company'].setValue(this.vendorInfo.Company);
                    this.addVendorForm.controls['EmailAddress'].setValue(this.vendorInfo.EmailAddress);
                    this.addVendorForm.controls['ContactNumber'].setValue(this.vendorInfo.ContactNumber);
                    this.addVendorForm.controls['AltContactNumber'].setValue(this.vendorInfo.AltContactNumber);
                    this.addVendorForm.controls['Website'].setValue(this.vendorInfo.Website);
                    this.addVendorForm.controls['ListingFee'].setValue(this.vendorInfo.ListingFee);
                    this.addVendorForm.controls['Address'].setValue(this.vendorInfo.Address);
                    this.addVendorForm.controls['CityId'].setValue(this.vendorInfo.CityId);
                    // this.addVendorForm.controls['state'].setValue(this.vendorInfo.state);
                    // this.addVendorForm.controls['country'].setValue(this.vendorInfo.country);
                    this.addVendorForm.controls['ZipCode'].setValue(this.vendorInfo.ZipCode);
                    this.addVendorForm.controls['IsActive'].setValue(this.vendorInfo.IsActive);
                    this.checkFormValidation();
                    this.bigLoader = false;
                }).catch((error) => {
                    console.log("error ", error);
                });
        }
    }

    checkFormValidation() {
        for (var i in this.addVendorForm.controls) {
            this.addVendorForm.controls[i].markAsTouched();
        }
    }

}
