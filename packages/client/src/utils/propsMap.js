// extract necessary states-props for the component
export const componentToStatePropsMap = ({
  currentAccount,
  setCurrentAccount,
  domain,
  setDomain,
  record,
  setRecord,
  network,
  setNetwork,
  editing,
  setEditing,
  loading,
  setLoading,
  mints,
  setMints,
}) => {
  return {
    propsToHeader: {
      network,
      currentAccount,
    },
    propsToNotConnectedContainer: {
      setCurrentAccount,
    },
    propsToInputForm: {
      domain,
      setDomain,
      record,
      setRecord,
      loading,
      setLoading,
      editing,
      setEditing,
      network,
      setMints,
    },
    propsToMints: {
      currentAccount,
      mints,
      setEditing,
      setDomain,
    }
  }
}