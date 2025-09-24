const ConvertCountryToID = (country)=>{
    let id = 0;
    switch (country){
        case 'Afghanistan':
            id = 4;
            break;
        case 'Albania':
            id = 8;
            break;    
    
        case 'Antarctica':
            id = 10;
            break;
        case 'Algeria':
            id = 12;
            break;
        case 'American Samoa':
            id = 16;
            break;    
    
        case 'Andorra':
            id = 20;
            break;
        case 'Angola':
            id = 24;
            break;
        case 'Antigua and Barbuda':
            id = 28;
            break;    
    
        case 'Azerbaijan':
            id = 31;
            break;
        case 'Argentina':
            id = 32;
            break;
        case 'Australia':
            id = 36;
            break;    
    
        case 'Austria':
            id = 10;
            break;
        case 'Bahamas':
            id = 44;
            break;
        case 'Bahrain':
            id = 48;
            break;    
    
        case 'Bangladesh':
            id = 50;
            break;        

        case 'Armenia':
            id = 51;
            break;
        case 'Barbados':
            id = 52;
            break;    
    
        case 'Belgium':
            id = 56;
            break;
        case 'Bermuda':
            id = 60;
            break;
        case 'Bhutan':
            id = 64;
            break;    
    
        case ('Bolivia'||'Plurinational State of Bolivia'):
            id = 68;
            break;
        case 'Bosnia and Herzegovina':
            id = 70;
            break;
        case 'Botswana':
            id = 72;
            break;    
    
        case 'Bouvet Island':
            id = 74;
            break;
        case 'Brazil':
            id = 76;
            break;
        case 'Belize':
            id = 84;
            break;    
    
        case 'British Indian Ocean Territory':
            id = 86;
            break;
        case 'Solomon Islands':
            id = 90;
            break;
        case ('Virgin Islands' || "British Virgin Islands"):
            id = 92;
            break;    
    
        case 'Brunei Darussalam':
            id = 96;
            break;
        case 'Bulgaria':
            id = 100;
            break;
        case 'Myanmar':
            id = 104;
            break;    
    
        case 'Burundi':
            id = 108;
            break;
        case 'Belarus':
            id = 112;
            break;
        case 'Cambodia':
            id = 116;
            break;    
    
        case 'Cameroon':
            id = 120;
            break;
        case 'Canada':
            id = 124;
            break;
        case 'Cabo Verde':
            id = 132;
            break;    
    
        case 'Cayman Islands':
            id = 136;
            break;
        case 'Central African Republic':
            id = 140;
            break;
        case 'Sri Lanka':
            id = 144;
            break;    
    
        case 'Chad':
            id = 148;
            break;
        case 'Chile':
            id = 152;
            break;
        case 'China':
            id = 156;
            break;    
    
        case 'Taiwan':
            id = 158;
            break;
        
        case 'Christmas Island':
            id = 162;
            break;

        case 'Cocos (Keeling) Islands':
            id = 166;
            break;    
    
        case 'Colombia':
            id = 170;
            break;

        case 'Comoros ':
            id = 174;
            break;

        case 'Mayotte':
            id = 175;
            break;    
    
        case 'Congo ':
            id = 178;
            break;

        case 'the Democratic Republic of the Congo':
            id = 180;
            break;

        case 'Cook Islands':
            id = 184;
            break;    
    
        case 'Costa Rica':
            id = 188;
            break;

        case 'Croatia':
            id = 191;
            break;

        case 'Cuba':
            id = 192;
            break;    
    
        case 'Cyprus':
            id = 196;
            break;

        case 'Czechia':
            id = 203;
            break;

        case 'Benin':
            id = 204;
            break;    
    
        case 'Denmark':
            id = 208;
            break;

        case 'Dominica':
            id = 212;
            break;

        case 'Dominican Republic':
            id = 214;
            break;    
    
        case 'Ecuador':
            id = 218;
            break;

        case 'El Salvador':
            id = 222;
            break;

        case 'Equatorial Guinea':
            id = 226;
            break;    
    
        case 'Ethiopia':
            id = 231;
            break;

        case 'Eritrea':
            id = 232;
            break;

        case 'Estonia':
            id = 233;
            break;    
    
        case 'Faroe Islands':
            id = 234;
            break;

        case 'Falkland Islands':
            id = 238;
            break;

        case 'South Georgia and the South Sandwich Islands':
            id = 239;
            break;    
    
        case 'Fiji':
            id = 242;
            break;

        case 'Finland':
            id = 246;
            break;

        case 'Åland Islands':
            id = 248;
            break;    
    
        case 'France':
            id = 250;
            break;

        case 'French Guiana':
            id = 254;
            break;

        case 'French Polynesia':
            id = 258;
            break;    
    
        case 'French Southern Territories ':
            id = 260;
            break;

        case 'Djibouti':
            id = 262;
            break;

        case 'Gabon':
            id = 266;
            break;    
    
        case 'Georgia':
            id = 268;
            break;

        case 'Gambia':
            id = 270;
            break;

        case 'Palestine':
            id = 275;
            break;  

        case 'Germany':
            id = 276;
            break;    
    
        case 'Ghana':
            id = 288;
            break;

        case 'Gibraltar':
            id = 292;
            break;  

        case 'Kiribati':
            id = 296;
            break;

        case 'Greece':
            id = 300;
            break;    
    
        case 'Greenland':
            id = 304;
            break;

        case 'Grenada':
            id = 308;
            break;

        case 'Guadeloupe':
            id = 312;
            break;    
    
        case 'Guam':
            id = 316;
            break;

        case 'Guatemala':
            id = 320;
            break;

        case 'Guinea':
            id = 324;
            break;    
    
        case 'Guyana':
            id = 328;
            break;

        case 'Haiti':
            id = 332;
            break;

        case 'Heard Island and McDonald Islands':
            id = 334;
            break;    
    
        case 'Holy See':
            id = 336;
            break;

        case 'Honduras':
            id = 340;
            break;

        case 'Hong Kong':
            id = 344;
            break;    
    
        case 'Hungary':
            id = 348;
            break;

        case 'Iceland':
            id = 352;
            break;

        case 'India':
            id = 356;
            break;    
    
        case 'Indonesia':
            id = 360;
            break;

        case ('Iran ' || 'Islamic Republic of Iran'):
            id = 364;
            break;

        case 'Iraq':
            id = 368;
            break;    
    
        case 'Ireland':
            id = 372;
            break;     

        case 'Israel':
            id = 376;
            break;

        case 'Italy':
            id = 380;
            break;    
    
        case 'Côte d’Ivoire':
            id = 384;
            break;

        case 'Jamaica':
            id = 388;
            break;

        case 'Japan':
            id = 392;
            break;    
    
        case 'Kazakhstan':
            id = 398;
            break;

        case 'Jordan':
            id = 400;
            break;

        case 'Kenya':
            id = 404;
            break;    
    
        case 'Korea' || ('The Democratic People’s Republic of Korea'):
            id = 408;
            break;

        case 'Korea' || ('The Republic of Korea'):
            id = 410;
            break;

        case 'Kuwait':
            id = 414;
            break;    
    
        case 'Kyrgyzstan':
            id = 417;
            break;

        case 'Lao People’s Democratic Republic':
            id = 418;
            break;

        case 'Lebanon':
            id = 422;
            break;    
    
        case 'Lesotho':
            id = 426;
            break;        

        case 'Latvia':
            id = 428;
            break;

        case 'Liberia':
            id = 430;
            break;    
    
        case 'Libya':
            id = 434;
            break;

        case 'Liechtenstein':
            id = 438;
            break;

        case 'Lithuania':
            id = 440;
            break;    
    
        case ('Luxembourg'):
            id = 442;
            break;

        case 'Macao':
            id = 446;
            break;

        case 'Madagascar':
            id = 450;
            break;    
    
        case 'Malawi':
            id = 454;
            break;

        case 'Malaysia':
            id = 458;
            break;

        case 'Maldives':
            id = 462;
            break;    
    
        case 'Mali':
            id = 466;
            break;

        case 'Malta':
            id = 470;
            break;

        case ('Martinique'):
            id = 474;
            break;    
    
        case 'Mauritania':
            id = 478;
            break;

        case 'Mexico':
            id = 484;
            break;

        case 'Monaco':
            id = 492;
            break;    
    
        case 'Mongolia':
            id = 496;
            break;

        case 'Moldova ':
            id = 498;
            break;

        case 'Montenegro':
            id = 499;
            break;    
    
        case 'Montserrat':
            id = 500;
            break;

        case 'Morocco':
            id = 504;
            break;

        case 'Mozambique':
            id = 508;
            break;    
    
        case 'Oman':
            id = 512;
            break;

        case 'Namibia':
            id = 516;
            break;

        case 'Nauru':
            id = 520;
            break;    
    
        case 'Nepal':
            id = 524;
            break;

        case 'Netherlands':
            id = 528;
            break;

        case 'Curaçao':
            id = 531;
            break;

        case 'Aruba':
            id = 533;
            break;    
    
        case 'Sint Maarten':
            id = 534;
            break;
        
        case 'Bonaire':
            id = 535;
            break;

        case 'New Caledonia':
            id = 540;
            break;    
    
        case 'Vanuatu':
            id = 548;
            break;

        case 'New Zealand ':
            id = 554;
            break;

        case 'Nicaragua':
            id = 558;
            break;    
    
        case 'Niger':
            id = 562;
            break;

        case 'Nigeria':
            id = 566;
            break;

        case 'Niue':
            id = 270;
            break;    
    
        case 'Norfolk Island':
            id = 574;
            break;

        case 'Norway':
            id = 578;
            break;

        case 'Northern Mariana Islands':
            id = 580;
            break;    
    
        case 'United States Minor Outlying Islands ':
            id = 581;
            break;

        case 'Micronesia':
            id = 583;
            break;

        case 'Marshall Islands':
            id = 584;
            break;    
    
        case 'Palau':
            id = 585;
            break;

        case 'Pakistan':
            id = 586;
            break;

        case 'Panama':
            id = 591;
            break;

        case 'Papua New Guinea':
            id = 598;
            break;    
    
        case 'Paraguay':
            id = 600;
            break;

        case 'Peru':
            id = 604;
            break;

        case 'Philippines ':
            id = 608;
            break;    
    
        case 'Pitcairn':
            id = 612;
            break;

        case 'Poland':
            id = 616;
            break;

        case 'Portugal':
            id = 620;
            break;    
    
        case 'Guinea-Bissau':
            id = 624;
            break;

        case 'Timor-Leste':
            id = 626;
            break;

        case 'Puerto Rico':
            id = 630;
            break;    
    
        case 'Qatar':
            id = 634;
            break;

        case 'Réunion':
            id = 638;
            break;

        case 'Romania':
            id = 642;
            break;    
    
        case 'Russia':
            id = 643;
            break;

        case 'Rwanda':
            id = 646;
            break;

        case 'Saint Barthélemy':
            id = 652;
            break;    
    
        case 'Saint Helena':
            id = 654;
            break;

        case 'Saint Kitts and Nevis':
            id = 659;
            break;

        case 'Anguilla':
            id = 660;
            break;    
    
        case 'Saint Lucia':
            id = 662;
            break;

        case 'Saint Martin':
            id = 663;
            break;

        case 'Saint Pierre and Miquelon':
            id = 666;
            break;    
    
        case 'Saint Vincent and the Grenadines':
            id = 670;
            break;

        case 'San Marino':
            id = 674;
            break;

        case 'Sao Tome and Principe':
            id = 678;
            break;    
    
        case 'Saudi Arabia':
            id = 682;
            break;

        case 'Senegal':
            id = 686;
            break;

        case 'Serbia':
            id = 688;
            break;    
    
        case 'Seychelles':
            id = 690;
            break;

        case 'Sierra Leone':
            id = 694;
            break;

        case 'Singapore':
            id = 702;
            break;    
    
        case 'Slovakia':
            id = 703;
            break;

        case 'Vietnam':
            id = 704;
            break;

        case 'Slovenia':
            id = 705;
            break;    
    
        case 'Somalia':
            id = 706;
            break;

        case 'South Africa':
            id = 710;
            break;

        case 'Zimbabwe':
            id = 716;
            break;    
    
        case 'Spain':
            id = 724;
            break;

        case 'South Sudan':
            id = 728;
            break;

        case 'Sudan':
            id = 729;
            break;    
    
        case 'Western Sahara':
            id = 732;
            break;

        case ('Suriname'):
            id = 740;
            break;

        case 'Svalbard and Jan Mayen':
            id = 744;
            break;  

        case 'Eswatini':
            id = 748;
            break;

        case 'Sweden':
            id = 752;
            break;  

        case 'Switzerland':
            id = 756;
            break;    
    
        case 'Syrian Arab Republic':
            id = 760;
            break;
        
        case 'Tajikistan':
            id = 762;
            break;

        case 'Thailand':
            id = 764;
            break;    
    
        case 'Togo':
            id = 768;
            break;

        case 'Tokelau':
            id = 772;
            break;

        case 'Tonga':
            id = 776;
            break;    
    
        case 'Trinidad and Tobago':
            id = 780;
            break;

        case 'United Arab Emirates':
            id = 784;
            break;

        case 'Tunisia':
            id = 788;
            break;    
    
        case ('Türkiye' || "Turkey"):
            id = 792;
            break;

        case 'Turkmenistan':
            id = 795;
            break;

        case 'Turks and Caicos Islands ':
            id = 796;
            break;    
    
        case 'Tuvalu':
            id = 798;
            break;

        case 'Uganda':
            id = 800;
            break;

        case 'Ukraine':
            id = 804;
            break;    

        case 'Egypt':
            id = 818;
            break;            

        case 'North Macedonia':
            id = 807;
            break;

        case ('United Kingdom' || 'UK' || 'Great Britain' || 'Britain'):
            id = 826;
            break;

        case 'Guernsey':
            id = 831;
            break;   

        case 'Jersey':
            id = 832;
            break;    
    
        case 'Isle of Man':
            id = 833;
            break;

        case 'Tanzania':
            id = 834;
            break;

        case ('United States of America' || 'USA'):
            id = 840;
            break;    
    
        case 'Virgin Islands':
            id = 850;
            break;

        case 'Burkina Faso':
            id = 854;
            break;

        case 'Uruguay':
            id = 858;
            break;    
    
        case 'Uzbekistan':
            id = 860;
            break;

        case 'Venezuela':
            id = 862;
            break;

        case 'Wallis and Futuna':
            id = 876;
            break;    
    
        case 'Samoa':
            id = 882;
            break;

        case 'Yemen':
            id = 887;
            break;

        case 'Zambia':
            id = 894;
            break;    
        default:
            id = 784
            break;        
        };
    return id;    
}

function ConvertIDToCountry(id){}

module.exports = {ConvertCountryToID};