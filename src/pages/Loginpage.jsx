import {
    Button, Tabs, Card, Container, Text, Stack, Input, Separator, Box, Link, Group, CloseButton, Dialog, Portal, Combobox,
    useFilter,
    useListCollection,
    HStack, RadioCard
} from "@chakra-ui/react"
import { PasswordInput } from "../components/ui/password-input"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import NavFirst from "../components/NavFirst";
import Footer from "../components/Footer";

import login from "../assets/login.json";
import Lottie from "lottie-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const country_list = [
    { code: "AF", name: "Afghanistan" },
    { code: "AX", name: "Åland Islands" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AS", name: "American Samoa" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AI", name: "Anguilla" },
    { code: "AQ", name: "Antarctica" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AW", name: "Aruba" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BM", name: "Bermuda" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia (Plurinational State of)" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BV", name: "Bouvet Island" },
    { code: "BR", name: "Brazil" },
    { code: "IO", name: "British Indian Ocean Territory" },
    { code: "BN", name: "Brunei Darussalam" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "CV", name: "Cabo Verde" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "BQ", name: "Caribbean Netherlands" },
    { code: "KY", name: "Cayman Islands" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CX", name: "Christmas Island" },
    { code: "CC", name: "Cocos (Keeling) Islands" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo, Democratic Republic of the" },
    { code: "CK", name: "Cook Islands" },
    { code: "CR", name: "Costa Rica" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CW", name: "Curaçao" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini (Swaziland)" },
    { code: "ET", name: "Ethiopia" },
    { code: "FK", name: "Falkland Islands (Malvinas)" },
    { code: "FO", name: "Faroe Islands" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GF", name: "French Guiana" },
    { code: "PF", name: "French Polynesia" },
    { code: "TF", name: "French Southern Territories" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GR", name: "Greece" },
    { code: "GL", name: "Greenland" },
    { code: "GD", name: "Grenada" },
    { code: "GP", name: "Guadeloupe" },
    { code: "GU", name: "Guam" },
    { code: "GT", name: "Guatemala" },
    { code: "GG", name: "Guernsey" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HM", name: "Heard Island and Mcdonald Islands" },
    { code: "HN", name: "Honduras" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IM", name: "Isle of Man" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JE", name: "Jersey" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KP", name: "Korea, North" },
    { code: "KR", name: "Korea, South" },
    { code: "XK", name: "Kosovo" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Lao People's Democratic Republic" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MO", name: "Macao" },
    { code: "MK", name: "Macedonia North" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MQ", name: "Martinique" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "YT", name: "Mayotte" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MS", name: "Montserrat" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar (Burma)" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NC", name: "New Caledonia" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "NU", name: "Niue" },
    { code: "NF", name: "Norfolk Island" },
    { code: "MP", name: "Northern Mariana Islands" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PS", name: "Palestine" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PN", name: "Pitcairn Islands" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "PR", name: "Puerto Rico" },
    { code: "QA", name: "Qatar" },
    { code: "RE", name: "Reunion" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russian Federation" },
    { code: "RW", name: "Rwanda" },
    { code: "BL", name: "Saint Barthelemy" },
    { code: "SH", name: "Saint Helena" },
    { code: "KN", name: "Saint Kitts and Nevis" },
    { code: "LC", name: "Saint Lucia" },
    { code: "MF", name: "Saint Martin" },
    { code: "PM", name: "Saint Pierre and Miquelon" },
    { code: "VC", name: "Saint Vincent and the Grenadines" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "Sao Tome and Principe" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SX", name: "Sint Maarten" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "GS", name: "South Georgia and the South Sandwich Islands" },
    { code: "SS", name: "South Sudan" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SJ", name: "Svalbard and Jan Mayen" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" },
    { code: "TW", name: "Taiwan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TK", name: "Tokelau" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey (Türkiye)" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TC", name: "Turks and Caicos Islands" },
    { code: "TV", name: "Tuvalu" },
    { code: "UM", name: "U.S. Outlying Islands" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VA", name: "Vatican City Holy See" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "VG", name: "Virgin Islands, British" },
    { code: "VI", name: "Virgin Islands, U.S" },
    { code: "WF", name: "Wallis and Futuna" },
    { code: "EH", name: "Western Sahara" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" }
];


function Loginpage() {

    const [logindata, setLoginData] = useState({
        email:"",
        password:""
    })

    useEffect(() => {
        const storedUser = localStorage.getItem("userdata");
        if (storedUser) {
            setLoginData(JSON.parse(storedUser));
        }
    }, []);


    const [data, setData] = useState({
        email: "",
        phone: "",
        password: "",
        name: "",
        gender: "",
        dob: "",
        country: ""
    });

    function savetolocal(data) {
        localStorage.setItem("userdata", JSON.stringify(data));
    }


    const { contains } = useFilter({ sensitivity: "base" })

    const { collection, filter } = useListCollection({
        initialItems: country_list,
        itemToString: (item) => item.name,
        itemToValue: (item) => item.name,
        filter: contains,
    })

    const items = [
        { value: "male", title: "Male" },
        { value: "female", title: "Female" },
        { value: "other", title: "Other" },
    ]

    const navigate = useNavigate();

    function checkDeatils(logindata) {
        const storedUser = JSON.parse(localStorage.getItem("userdata"));
        if (storedUser && storedUser.email===logindata.email && storedUser.password===logindata.password ){
            alert("login succesfull");
            navigate("/home/")
        }
        else{
            alert("Invalid credential");
        }
       
    }
    const [open, setOpen] = useState(false)

    function checkempty(data) {
        {
            if (!data.email.trim() && !data.password.trim() && !data.phone.trim()) {
                alert("Every field is mandatory!");

                return true;

            }
            return false;
        }
    }


    return (
        <>


            <NavFirst />

            <Card.Root variant={"elevated"} >
                <Lottie animationData={login} loop={true}
                    style={{
                        width: "300px", height: "200px", marginTop: "12%", alignSelf: "center", margin: "0"
                    }}
                />
                <Box >
                    <Card.Title >
                        <Text textAlign="center">
                            WELCOME TO CAMP
                        </Text>
                    </Card.Title>
                    <Card.Body>
                        <Tabs.Root defaultValue={"Tab1"}>
                            <Tabs.List>
                                <Tabs.Trigger value='Tab1'>
                                    <Text>Login</Text>
                                </Tabs.Trigger>
                                <Tabs.Trigger value='Tab2'>
                                    <Text>Signup</Text>
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value='Tab1' >
                                <Box boxAlign="center" textAlign={"center"} overflow="hidden" >
                                    <Input type='email' placeholder='Username/Email' mb="5" value={logindata.email} onChange={(e) => {
                                        setLoginData({ ...logindata, email: e.target.value })
                                    }} required />
                                    <PasswordInput placeholder='Password' value={logindata.password} onChange={(e) => {
                                        setLoginData({ ...logindata, password: e.target.value })
                                    }} />
                                    <Button mt="5" colorPalette="gray" rounded={"md"} variant="outline" onClick={() => { checkDeatils(logindata) }}>Login</Button>
                                </Box>
                                <Separator mt='5' />
                                <Text textAlign="center" mt="4">or <br />
                                    Continue with
                                </Text>
                                <Group grow mt='3'>
                                    <Button variant='outline' onClick={() => { console.log("Google") }}><FcGoogle /></Button>
                                    <Button variant="outline" onClick={() => { console.log("Apple") }}><FaApple /></Button>
                                </Group>
                            </Tabs.Content>
                            <Tabs.Content value='Tab2'>
                                <Box boxAlign="center" textAlign={"center"} overflow="hidden"  >
                                    <Input type='email' placeholder='Email address' mb="5" id="email" value={data.email} onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
                                    <Input type='tel' placeholder='Phone no.' maxLength={10} mb="5" id="phone" value={data.phone} onChange={(e) => { setData({ ...data, phone: e.target.value }) }} />
                                    <PasswordInput placeholder='Set Password' id="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                                    <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom" open={open} onOpenChange={(e) => {
                                        {
                                            if (checkempty(data)) {
                                                setOpen(false);
                                            }
                                            else {
                                                setOpen(true);
                                            }
                                        }
                                    }}>
                                        <Dialog.Trigger asChild>
                                            <Button mt="5" colorPalette="gray" variant="outline" onClick={() => {

                                            }}>Create Account</Button>
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content overflowY="auto" >
                                                    <Dialog.Header>
                                                        <Dialog.Title>Personal Details</Dialog.Title>
                                                        <Dialog.CloseTrigger asChild>
                                                            <CloseButton size="sm" />
                                                        </Dialog.CloseTrigger>
                                                    </Dialog.Header>
                                                    <Dialog.Body>
                                                        <Stack>
                                                            <Text >
                                                                NAME
                                                            </Text>
                                                            <Input onChange={(e) => { setData({ ...data, name: e.target.value }) }} />

                                                            <Text>
                                                                GENDER
                                                            </Text>
                                                            <RadioCard.Root defaultValue="next" >
                                                                <RadioCard.Label>Select Gender</RadioCard.Label>
                                                                <HStack align="stretch" gap="2" wrap="wrap">
                                                                    {items.map((item) => (
                                                                        <RadioCard.Item key={item.value} value={item.value} onChange={() => { setData({ ...data, gender: item.value }) }}>
                                                                            <RadioCard.ItemHiddenInput />
                                                                            <RadioCard.ItemControl>
                                                                                <RadioCard.ItemIndicator />
                                                                                <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
                                                                            </RadioCard.ItemControl>
                                                                        </RadioCard.Item>
                                                                    ))}
                                                                </HStack>

                                                            </RadioCard.Root>
                                                            <Text>
                                                                DATE OF BIRTH
                                                            </Text>
                                                            <Input type="date" value={data.dob} onChange={(e) => { setData({ ...data, dob: e.target.value }) }} />
                                                            <Text>
                                                                COUNTRY
                                                            </Text>
                                                            <Combobox.Root
                                                                collection={collection}
                                                                onInputValueChange={(e) => {
                                                                    filter(e.inputValue);
                                                                    setData({ ...data, country: e.inputValue });
                                                                }



                                                                }
                                                                width="320px"
                                                            >
                                                                <Combobox.Label>Select Country</Combobox.Label>
                                                                <Combobox.Control>
                                                                    <Combobox.Input placeholder="Type to search" />
                                                                    <Combobox.IndicatorGroup>
                                                                        <Combobox.ClearTrigger />
                                                                        <Combobox.Trigger />
                                                                    </Combobox.IndicatorGroup>
                                                                </Combobox.Control>
                                                                <Portal disabled>
                                                                    <Combobox.Positioner>
                                                                        <Combobox.Content>
                                                                            <Combobox.Empty>No items found</Combobox.Empty>
                                                                            {collection.items.map((item) => (
                                                                                <Combobox.Item item={item} key={item.name}>
                                                                                    {item.name}
                                                                                    <Combobox.ItemIndicator />
                                                                                </Combobox.Item>
                                                                            ))}
                                                                        </Combobox.Content>
                                                                    </Combobox.Positioner>
                                                                </Portal>
                                                            </Combobox.Root>
                                                        </Stack>
                                                        <Dialog.Footer>
                                                            <Button rounded={"full"} onClick={() => {
                                                                { alert("Account created, Login to continue!") }
                                                                savetolocal(data)
                                                                navigate(0)
                                                            }}>Save</Button>
                                                        </Dialog.Footer>
                                                    </Dialog.Body>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                    </Dialog.Root>
                                    <Separator mt='5' mb="3" />

                                </Box>
                            </Tabs.Content>
                        </Tabs.Root>
                    </Card.Body>
                    <Card.Footer >
                        <Text>By creating the account you will accept the platform "<Link href="..">Terms and Conditions</Link>" for using it.</Text>
                    </Card.Footer>

                </Box>
            </Card.Root>
            <Footer />

        </>
    )
}

export default Loginpage;