from tabula import read_pdf
import pandas as pd
from pathlib import Path
from datetime import datetime

# List all files in directory using pathlib

data = pd.DataFrame(columns=["Date",
                             "Country/Territory/Area", "Total confirmed cases",
                             "Total confirmed new cases", "Total deaths", "Total new deaths", "Transmition classification", "Days since last reported case"])
extraction_errors = []

countries = pd.read_csv("countries_data.tsv", sep="\t", index_col=0)

basepath = Path('reports/')
files_in_basepath = (entry for entry in basepath.iterdir() if entry.is_file())

for pdf in files_in_basepath:
    print(pdf.name)
    report_date = pdf.name[:8]
    date_obj = datetime.strptime(report_date, '%Y%m%d')

    pdf_data = read_pdf(pdf,
                        pages="all", pandas_options={'header': None})
    # Load areas and regions outside of china
    for page_id, page in enumerate(pdf_data):
        if len(page.columns) == 7:
            page = page.dropna()
            for id in range(len(page)):
                entry = page.iloc[id]
                if entry[0] in countries["Country (or dependency)"].values:
                    data = data.append(pd.DataFrame(
                        [[date_obj.strftime("%Y-%m-%d"),
                          entry[0],
                          entry[1],
                          entry[2],
                          entry[3],
                          entry[4],
                          entry[5],
                          entry[6]]],
                        columns=data.columns), ignore_index=True
                    )
                else:
                    # Handle some paging and pdf extract issues
                    if(entry[0] == "United States of"):
                        name = "United States of America"
                    elif(entry[0] == "America"):
                        name = "United States of America"
                    elif(entry[0] == "State of)"):
                        name = "Bolivia (Plurinational State of)"
                    elif(entry[0] == "Republic of)"):
                        name = "Venezuela (Bolivarian Republic of)"
                    elif(entry[0] == "Republic of)"):
                        name = "Venezuela (Bolivarian Republic of)"
                    elif(entry[0] == "France^^"):
                        name = "France"
                    elif(entry[0] == "Serbia††"):
                        name = "Serbia"
                    elif(entry[0] == "Kingdom¶"):
                        name = "The United Kingdom"
                    elif(entry[0] == "Kingdom^^"):
                        name = "The United Kingdom"
                    elif(entry[0] == "the United Kingdom"):
                        name = "The United Kingdom"
                    elif(entry[0] == "Switzerland^^"):
                        name = "Switzerland"
                    elif(entry[0] == "Cote d Ivoire"):
                        name = "Cote d’Ivoire"
                    elif(entry[0] == "Côte d’Ivoire"):
                        name = "Cote d’Ivoire"
                    elif(entry[0] == "conveyance"):
                        name = "International conveyance (Diamond Princess)"
                    elif(entry[0] == "of the Congo"):
                        name = "Democratic Republic of the Congo"
                    elif(entry[0] == "Grenadines"):
                        name = "Saint Vincent and the Grenadines"
                    elif(entry[0] == "Emirates"):
                        name = "United Arab Emirates"
                    elif(entry[0] == "Saint Barthélemy"):
                        name = "Saint Barthelemy"
                    elif(entry[0] == "Occupied Palestinian territory"):
                        name = "occupied Palestinian territory"
                    elif(entry[0] == "Occupied Palestinian Territory"):
                        name = "occupied Palestinian territory"
                    else:
                        name = entry[0].replace("\r", " ")

                    if name in countries["Country (or dependency)"].values:
                        data = data.append(pd.DataFrame(
                            [[date_obj.strftime("%Y-%m-%d"),
                              name,
                              entry[1],
                              entry[2],
                              entry[3],
                              entry[4],
                              entry[5],
                              entry[6]]],
                            columns=data.columns), ignore_index=True
                        )
                    else:
                        extraction_errors.append([
                            pdf.name,
                            name,
                            page_id,
                            id])

        else:
            print("Problem on page.")
print(extraction_errors)

data.to_csv("covid_19.csv", index=False)
