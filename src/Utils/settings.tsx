export const getSettings = () => {
  const values: any = localStorage.getItem("VelzorixStreamSettings");
  return JSON.parse(values);
};

export const setSettings = ({ values }: any) => {
  // var values = getSettings() || {
  //   theme: "", mode: "", ascent_color: ""
  // };
  // values[type] = value;
  localStorage.setItem("VelzorixStreamSettings", JSON.stringify(values));
};
