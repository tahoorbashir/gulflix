export const getSettings = () => {
  const values: any = localStorage.getItem("GulFlixStreamSettings");
  return JSON.parse(values);
};

export const setSettings = ({ values }: any) => {
  // var values = getSettings() || {
  //   theme: "", mode: "", ascent_color: ""
  // };
  // values[type] = value;
  localStorage.setItem("GulFlixStreamSettings", JSON.stringify(values));
};
