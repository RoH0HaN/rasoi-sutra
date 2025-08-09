function validateFields(body, requiredFields, res) {
  const missingFields = requiredFields
    .filter((field) => {
      return !Object.keys(body).includes(field);
    })
    .map((field) => field);

  return missingFields;
}

export { validateFields };
