class Error:
    def bugsDectect(self, errorMessageDict:dict):
        if len(errorMessageDict) == 0:
            print("no error")
        else:
            for error in errorMessageDict.keys():
                print("subject: " + errorMessageDict[error] + " has error: " + error)
