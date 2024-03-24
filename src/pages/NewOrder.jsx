import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardActions,
  CardOverflow,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Step,
  StepIndicator,
  Stepper
} from "@mui/joy";
import { Check, EmailRounded, InfoOutlined } from "@mui/icons-material";
import { forwardRef, useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { useDispatch, useSelector } from "react-redux";
import { getPortal } from "../redux/features/portal.slice";
import { axiosWithCredentials } from "../configs/axios";
import { createCase } from "../redux/features/case.slice";
import { nullIfEmpty } from "../utils/strings";

const ErrorMessage = ({message}) => {
    return (
        <>
        {message &&
            <FormHelperText>
                {message}
            </FormHelperText>
        }
        </>
    )
}

const TextMaskAdapter = forwardRef(function TextMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const relations = [
  { key: "", value: "", label: "" },
  { key: "Son", value: "Son", label: "Son" },
  { key: "Daughter", value: "Daughter", label: "Daughter" },
  { key: "Father", value: "Father", label: "Father" },
  { key: "Mother", value: "Mother", label: "Mother" },
  { key: "Grandfather", value: "Grandfather", label: "Grandfather" },
  { key: "Grandmother", value: "Grandmother", label: "Grandmother" },
  { key: "Aunt", value: "Aunt", label: "Aunt" },
  { key: "Uncle", value: "Uncle", label: "Uncle" },
  { key: "Cousin", value: "Cousin", label: "Cousin" },
  { key: "Friend", value: "Friend", label: "Friend" },
  { key: "Other", value: "Other", label: "Other" },
];

export default function NewOrder() {
  const [step, setStep] = useState(0);

  const [dFirstName, setDFirstName] = useState("");
  const [dLastName, setDLastName] = useState("");
  const [dSex, setDSex] = useState("");
  const [dAge, setDAge] = useState("");
  const [dResidence, setDResidence] = useState("");
  const [dDateOfDeath, setDDateOfDeath] = useState("");
  const [dCauseOfDeath, setDCauseOfDeath] = useState("");
  const [cFirstName, setCFirstName] = useState("");
  const [cLastName, setCLastName] = useState("");
  const [cRelation, setCRelation] = useState("");
  const [cPhoneNumber, setCPhoneNumber] = useState("");
  const [cOtherRelation, setCOtherRelation] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [home, setHome] = useState("");
  const [director, setDirector] = useState("");
  const [service, setService] = useState("");
  const [preArranged, setPreArranged] = useState(false);

  const [dFirstNameError, setDFirstNameError] = useState("");
  const [dLastNameError, setDLastNameError] = useState("");
  const [dSexError, setDSexError] = useState("");
  const [dAgeError, setDAgeError] = useState("");
  const [dResidenceError, setDResidenceError] = useState("");
  const [dDateOfDeathError, setDDateOfDeathError] = useState("");
  const [dCauseOfDeathError, setDCauseOfDeathError] = useState("");
  const [cFirstNameError, setCFirstNameError] = useState("");
  const [cLastNameError, setCLastNameError] = useState("");
  const [cRelationError, setCRelationError] = useState("");
  const [cPhoneNumberError, setCPhoneNumberError] = useState("");
  const [cOtherRelationError, setCOtherRelationError] = useState("");
  const [cEmailError, setCEmailError] = useState("");
  const [homeError, setHomeError] = useState("");
  const [directorError, setDirectorError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [options, setOptions] = useState({
    Homes: [],
    Services: [],
    Users: []
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const portal = useSelector(getPortal);
  const dispatch = useDispatch();

  function handleDeceasedSubmission()
  {
    setDFirstNameError(!dFirstName ? "Required": "");
    setDLastNameError(!dLastName ? "Required": "");
    setDSexError(!dSex ? "Required" : "");

    if(dFirstName && dLastName && dSex){
        setStep(1);
    }
  }

  function handleCustomerSubmission()
  {
    setStep(2);
  }

  function handleSubmitOrder()
  {

    setHomeError(!home ? "Required": "");
    setServiceError(!service ? "Required": "");
    setDirectorError(!director ? "Required": "");

    if(home && service && director){
        var payload = {
            Contact: {
                FirstName: nullIfEmpty(cFirstName),
                LastName: nullIfEmpty(cLastName),
                Email: nullIfEmpty(cEmail),
                PhoneNumber: nullIfEmpty(cPhoneNumber),
                Relation: (cRelation === "Other") ? cOtherRelation : cRelation
            },
            Patient: {
                FirstName: dFirstName,
                LastName: dLastName,
                Sex: dSex,
                Age: dAge,
                Residence: dResidence,
                CauseOfDeath: dCauseOfDeath,
                DateOfDeath: dDateOfDeath
            },
            ServiceID: service,
            HomeID: home,
            UserID: director,
            Status: "Active",
            PortalID: portal.ID,
            PreArranged: preArranged
        }
        setLoading(true);
        axiosWithCredentials.post('/case', payload)
        .then(res => {
            if(res.data.DisplayID){
                navigate('/order?id=' + res.data.DisplayID);
            }
        })
        .finally(() => setLoading(false))
    }
  }


  const render = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Stack spacing={2}>
              <FormControl error={dFirstNameError} required size="sm" className="transition-all duration-300">
                <FormLabel>First Name</FormLabel>
                <Input
                slotProps={{
                    input: {
                      maxLength: 45,
                    },
                  }}
                  value={dFirstName}
                  onChange={(e) => {
                    setDFirstNameError('');
                    setDFirstName(e.target.value)
                }}
                />
                <ErrorMessage message={dFirstNameError}/>
              </FormControl>
              <FormControl error={dLastNameError} required size="sm">
                <FormLabel>Last Name</FormLabel>
                <Input 
                slotProps={{
                    input: {
                      maxLength: 45,
                    },
                  }}
                  value={dLastName}
                  onChange={(e) => {
                    setDLastNameError('');
                    setDLastName(e.target.value)
                }}
                />
                <ErrorMessage message={dLastNameError}/>
              </FormControl>
            </Stack>
            <FormControl error={dSexError} required size="sm">
              <FormLabel>Sex</FormLabel>
              <Select
              value={dSex}
              onChange={(e,data) => {
                setDSexError('');
                setDSex(data);
              }}
              >
                <Option value="M">Male</Option>
                <Option value="F">Female</Option>
              </Select>
              <ErrorMessage message={dSexError}/>
            </FormControl>
            <FormControl error={dAgeError} size="sm">
              <FormLabel>Age</FormLabel>
              <Input 
              type="number" 
              value={dAge}
              onChange={(e,data) => setDAge(e.target.value.slice(0,3))}
              />
              <ErrorMessage message={dAgeError}/>
            </FormControl>
            <FormControl error={dResidenceError} size="sm">
              <FormLabel>Residence</FormLabel>
              <Input 
                slotProps={{
                    input: {
                      maxLength: 128,
                    },
                  }}
                  value={dResidence}
                  onChange={(e) => setDResidence(e.target.value)}
                />
                <ErrorMessage message={dResidenceError}/>
            </FormControl>
            <FormControl error={dCauseOfDeathError} size="sm">
              <FormLabel>Cause of Death</FormLabel>
              <Input 
                slotProps={{
                    input: {
                      maxLength: 64,
                    },
                  }}
                  value={dCauseOfDeath}
                  onChange={(e) => setDCauseOfDeath(e.target.value)}
                />
                <ErrorMessage message={dCauseOfDeathError}/>
            </FormControl>
            <FormControl error={dDateOfDeathError} size="sm">
              <FormLabel>Date of Death</FormLabel>
              <Input 
              type="date" 
              value={dDateOfDeath}
              onChange={(e) => setDDateOfDeath(e.target.value)}
              />
              <ErrorMessage message={dDateOfDeathError}/>
            </FormControl>
          </>
        );
      case 1:
        return (
          <>
            <Stack spacing={2}>
              <FormControl size="sm">
                <FormLabel>First Name</FormLabel>
                <Input
                  slotProps={{
                    input: {
                      maxLength: 45,
                    },
                  }}
                  value={cFirstName}
                  onChange={(e) => setCFirstName(e.target.value)}
                />
              </FormControl>
              <FormControl size="sm">
                <FormLabel>Last Name</FormLabel>
                <Input
                  slotProps={{
                    input: {
                      maxLength: 45,
                    },
                  }}
                  value={cLastName}
                  onChange={(e) => setCLastName(e.target.value)}
                />
              </FormControl>
            </Stack>
            <FormControl size="sm" >
            <FormLabel>Relation to Deceased</FormLabel>
              <Stack direction={"row"} sx={{width: '100%'}}>
              <Select
              className="transition-all duration-200"
              sx={{
                width: cRelation === 'Other' ? '50%' : '100%', 
                mr: cRelation === 'Other' ? 2 : 0
              }}
                value={cRelation}
                onChange={(e, data) => {setCRelation(data); setCOtherRelation('')}}
              >
                {relations.map((x) => {
                  return <Option value={x.value}>{x.label}</Option>;
                })}
              </Select>
              {cRelation === 'Other' &&
                <Input 
                slotProps={{
                    input: {
                      maxLength: 45,
                    },
                }}
                placeholder="Specify relation"
                value={cOtherRelation}
                onChange={(e) => setCOtherRelation(e.target.value)}
                />  
                }
              </Stack>
            </FormControl>
            <FormControl size="sm">
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={cPhoneNumber}
                onChange={(event) => setCPhoneNumber(event.target.value)}
                slotProps={{ input: { component: TextMaskAdapter } }}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel>Email</FormLabel>
              <Input 
              slotProps={{
                input: {
                  maxLength: 64,
                },
              }}
              type="email" 
              value={cEmail} 
              onChange={(event) => setCEmail(event.target.value)} 
              />
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <Stack spacing={2}>
              <FormControl error={homeError} required size="sm">
                <FormLabel>Home</FormLabel>
                <Select
                  value={home}
                  onChange={(e, data) => {
                    setHomeError('');
                    setHome(data);
                  }}
                >
                  {options?.Homes.map((x) => {
                    return <Option value={x.value}>{x.label}</Option>;
                  })}
                </Select>
                <ErrorMessage message={homeError}/>
              </FormControl>
              <FormControl error={serviceError} required size="sm">
                <FormLabel>Service</FormLabel>
                <Select
                  value={service}
                  onChange={(e, data) => {
                    setServiceError('');
                    setService(data);
                  }}
                >
                  {options?.Services.map((x) => {
                    return <Option value={x.value}>{x.label}</Option>;
                  })}
                </Select>
                <ErrorMessage message={serviceError}/>
              </FormControl>
            </Stack>
            <FormControl error={directorError} required size="sm">
              <FormLabel>Director</FormLabel>
              <Select
                value={director}
                onChange={(e, data) => {
                    setDirectorError('');
                    setDirector(data);
                }}
              >
                {options?.Users.map((x) => {
                  return <Option value={x.value}>{x.label}</Option>;
                })}
              </Select>
              <ErrorMessage message={directorError}/>
            </FormControl>
            <FormControl size='sm'>
                <Checkbox label="Prearranged" checked={preArranged} onChange={(e) => setPreArranged(e.target.checked)} />
            </FormControl>
          </>
        );
    }
  };

  useEffect(() => {

    if(portal){
        var payload = {
            PortalID: portal.ID
        }

        axiosWithCredentials.post('/procedure/getHomesServicesEmployees', payload)
        .then(res => {
            var homes = res.data.Homes.map(x => ({value: x.ID, label: x.Name}));
            var services = res.data.Services.map(x => ({ value: x.ID, label: x.Name}));
            var users = res.data.Users.map(x => ({ value: x.ID, label: x.FirstName + " " + x.LastName}));

            setOptions({
                Homes: homes,
                Services: services,
                Users: users
            });
        
        })
        .catch(err => {

        })
    }
}, [portal]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                New Order
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              New Order
            </Typography>
          </Box>
          <Box sx={{ flex: 1, width: "100%" }}>
            <Stack
              spacing={4}
              sx={{
                display: "flex",
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              <Card>
                <Box>
                  <Stepper>
                    <Step
                      orientation="vertical"
                      onClick
                      indicator={
                        <StepIndicator
                          variant={step >= 0 ? "solid" : "soft"}
                          color="primary"
                        >
                          {step > 0 ? <Check /> : "1"}
                        </StepIndicator>
                      }
                    >
                      Deceased
                    </Step>
                    <Step
                      orientation="vertical"
                      indicator={
                        <StepIndicator
                          variant={step >= 1 ? "solid" : "soft"}
                          color="primary"
                        >
                          {step > 1 ? <Check /> : "2"}
                        </StepIndicator>
                      }
                    >
                      Customer
                    </Step>
                    <Step
                      orientation="vertical"
                      indicator={
                        <StepIndicator
                          variant={step >= 2 ? "solid" : "soft"}
                          color="primary"
                        >
                          {step > 2 ? <Check /> : "3"}
                        </StepIndicator>
                      }
                    >
                      Processing
                    </Step>
                  </Stepper>
                </Box>
                <Divider />
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
                >
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    {render()}
                  </Stack>
                </Stack>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
                >
                  {render()}
                </Stack>
                <CardOverflow
                  sx={{ borderTop: "1px solid", borderColor: "divider" }}
                >
                  <CardActions sx={{ alignSelf: { md: "flex-end", xs: "center"}, width: { xs: '100%', md: 'auto'}, pt: 2 }}>
                    {step > 0 &&
                    <Button sx={{width: { xs: '100%'}}} onClick={() => setStep(step - 1)} size="sm" variant="outlined" color="neutral">
                    Back
                    </Button>
                    }
                    {step === 2 ? (
                      <Button loading={loading} sx={{width: { xs: '100% '}}} onClick={handleSubmitOrder} size="sm" variant="solid">
                        Submit
                      </Button>
                    ) : (
                      <Button 
                      sx={{width: { xs: '100% '}}} 
                      onClick={() => {
                        switch(step){
                            case 0:
                                handleDeceasedSubmission();
                                break;
                            case 1:
                                handleCustomerSubmission();
                                break;
                        }
                      }} 
                      size="sm" 
                      variant="solid">
                        Next
                      </Button>
                    )}
                  </CardActions>
                </CardOverflow>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
