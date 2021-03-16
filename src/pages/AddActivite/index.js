import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../services/api";
import * as yup from "yup";
import GlobalWrap from "../../components/GlobalWrap";
import GlobalContainer from "../../components/GlobalContainer";
import BackGroundImage from "../../components/BackGroundImage";
import FormUserInput from "../../components/FormUserInput";
import Background from "../../Images/BackgroundAddGroup.jpg";
import Menu from "../../components/Menu";
import FormAction from "../../components/FormAction";

const AddGroup = () => {
  const [activiteError, setActiviteError] = useState({});
  const [inputTitle, setInputTitle] = useState("");

  const [token] = useState(() => {
    const sessionToken = localStorage.getItem("token") || "";
    return JSON.parse(sessionToken);
  });

  const schema = yup.object().shape({
    title: yup.string().required("Field Required"),
  });

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleForm = async (data) => {
    const today = new Date().toLocaleString();
    const fullData = today.split(" ")[0];
    const year = fullData.split("/")[2];
    const month = fullData.split("/")[1];
    const day = fullData.split("/")[0];
    const time = today.split(" ")[1];
    const realizationTime = `${year}-${month}-${day}T${time}Z`;
    data = { ...data, realization_time: realizationTime, group: 11 };

    await api
      .post("/activities/", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        reset();
      })
      .catch((e) => setActiviteError(e.response));
  };

  return (
    <>
      <GlobalContainer>
        <BackGroundImage image={Background} />
        <GlobalWrap>
          <FormAction
            handleSubmit={handleSubmit(handleForm)}
            title="Add Activite"
          >
            <FormUserInput
              name="title"
              inputRef={register}
              error={errors.title}
              value={inputTitle}
              setInputValue={setInputTitle}
            >
              Name
            </FormUserInput>
          </FormAction>
        </GlobalWrap>
      </GlobalContainer>
      <Menu />
    </>
  );
};

export default AddGroup;