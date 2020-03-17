from tabula import read_pdf
import pandas as pd

all_data = {}
data_one_day = pd.DataFrame(columns=[
    "Country/Territory/Area", "Total confirmed cases",
    "Total confirmed new cases", "Total deaths", "Total new deaths", "Transmition classification", "Days since last reported case"])

countries = pd.read_csv("countries_data.tsv", sep="\t", index_col=0)

pdf_data = read_pdf("reports/20200315-sitrep-55-covid-19.pdf",
                    pages="all", pandas_options={'header': None})

# Load areas and regions outside of china
for page in pdf_data:
    if len(page.columns) == 7:
        page = page.dropna()
        for id in range(len(page)):
            entry = page.iloc[id]
            if entry[0] in countries["Country (or dependency)"].values:
                data_one_day = data_one_day.append(pd.DataFrame(
                    [[entry[0],
                      entry[1],
                      entry[2],
                      entry[3],
                      entry[4],
                      entry[5],
                      entry[6]]],
                    columns=data_one_day.columns), ignore_index=True
                )
            else:
                # Handle some paging issues
                if(entry[0] == "United States of"):
                    name = "United States of America"
                elif(entry[0] == "conveyance"):
                    name = "International conveyance (Diamond Princess)"
                else:
                    name = entry[0].replace("\r", " ")

                if name in countries["Country (or dependency)"].values:
                    data_one_day = data_one_day.append(pd.DataFrame(
                        [[name,
                          entry[1],
                          entry[2],
                          entry[3],
                          entry[4],
                          entry[5],
                          entry[6]]],
                        columns=data_one_day.columns), ignore_index=True
                    )
                else:
                    print(name, "not in list of countries.")

    else:
        print("Problem on page.")
