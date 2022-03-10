import * as xml2json from "xml2json";
import * as fs from "fs/promises";

export async function convertItems(): Promise<void> {
  const xmlInput = await fs.readFile("./src/resources/DnD-Data/Items/Mundane-Items.xml");

  const jsonOutput = xml2json.toJson(xmlInput);
  fs.writeFile("./test.json", jsonOutput);
}

export async function createBaseCurrencies(): Promise<void> {
  const currencies = [
    {
      name: "Copper",
      shortName: "cp",
      weight: "0.02",
      description: [
        "Common coins come in several different denominations based on the relative worth of the metal from which they are made. The three most common coins are the gold piece (gp), the silver piece (sp), and the copper piece (cp).",
        "\n",
        "With one gold piece, a character can buy a belt pouch, 50 feet of good rope, or a goat. A skilled (but not exceptional) artisan can earn one gold piece a day. The gold piece is the standard unit of measure for wealth, even if the coin itself is not commonly used. When merchants discuss deals that involve goods or services worth hundreds or thousands of gold pieces, the transactions don't usually involve the exchange of individual coins. Rather, the gold piece is a standard measure of value, and the actual exchange is in gold bars, letters of credit, or valuable goods.",
        "\n",
        "One gold piece is worth ten silver pieces, the most prevalent coin among commoners. A silver piece buys a laborer's work for a day, a flask of lamp oil, or a night's rest in a poor inn.",
        "\n",
        "One silver piece is worth ten copper pieces, which are common among laborers and beggars. A single copper piece buys a candle, a torch, or a piece of chalk.",
        "\n",
        "In addition, unusual coins made of other precious metals sometimes appear in treasure hoards. The electrum piece (ep) and the platinum piece (pp) originate from fallen empires and lost kingdoms, and they sometimes arouse suspicion and skepticism when used in transactions. An electrum piece is worth five silver pieces, and a platinum piece is worth ten gold pieces.",
        "\n",
        "A standard coin weighs about a third of an ounce, so fifty coins weigh a pound.",
        "\n",
        "Source: Player's Handbook, page 143",
      ],
    },
    {
      name: "Electrum",
      shortName: "ep",
      weight: "0.02",
      description: [
        "Common coins come in several different denominations based on the relative worth of the metal from which they are made. The three most common coins are the gold piece (gp), the silver piece (sp), and the copper piece (cp).",
        "\n",
        "With one gold piece, a character can buy a belt pouch, 50 feet of good rope, or a goat. A skilled (but not exceptional) artisan can earn one gold piece a day. The gold piece is the standard unit of measure for wealth, even if the coin itself is not commonly used. When merchants discuss deals that involve goods or services worth hundreds or thousands of gold pieces, the transactions don't usually involve the exchange of individual coins. Rather, the gold piece is a standard measure of value, and the actual exchange is in gold bars, letters of credit, or valuable goods.",
        "\n",
        "One gold piece is worth ten silver pieces, the most prevalent coin among commoners. A silver piece buys a laborer's work for a day, a flask of lamp oil, or a night's rest in a poor inn.",
        "\n",
        "One silver piece is worth ten copper pieces, which are common among laborers and beggars. A single copper piece buys a candle, a torch, or a piece of chalk.",
        "\n",
        "In addition, unusual coins made of other precious metals sometimes appear in treasure hoards. The electrum piece (ep) and the platinum piece (pp) originate from fallen empires and lost kingdoms, and they sometimes arouse suspicion and skepticism when used in transactions. An electrum piece is worth five silver pieces, and a platinum piece is worth ten gold pieces.",
        "\n",
        "A standard coin weighs about a third of an ounce, so fifty coins weigh a pound.",
        "\n",
        "Source: Player's Handbook, page 143",
      ],
    },
    {
      name: "Gold",
      shortName: "gp",
      weight: "0.02",
      description: [
        "Common coins come in several different denominations based on the relative worth of the metal from which they are made. The three most common coins are the gold piece (gp), the silver piece (sp), and the copper piece (cp).",
        "\n",
        "With one gold piece, a character can buy a belt pouch, 50 feet of good rope, or a goat. A skilled (but not exceptional) artisan can earn one gold piece a day. The gold piece is the standard unit of measure for wealth, even if the coin itself is not commonly used. When merchants discuss deals that involve goods or services worth hundreds or thousands of gold pieces, the transactions don't usually involve the exchange of individual coins. Rather, the gold piece is a standard measure of value, and the actual exchange is in gold bars, letters of credit, or valuable goods.",
        "\n",
        "One gold piece is worth ten silver pieces, the most prevalent coin among commoners. A silver piece buys a laborer's work for a day, a flask of lamp oil, or a night's rest in a poor inn.",
        "\n",
        "One silver piece is worth ten copper pieces, which are common among laborers and beggars. A single copper piece buys a candle, a torch, or a piece of chalk.",
        "\n",
        "In addition, unusual coins made of other precious metals sometimes appear in treasure hoards. The electrum piece (ep) and the platinum piece (pp) originate from fallen empires and lost kingdoms, and they sometimes arouse suspicion and skepticism when used in transactions. An electrum piece is worth five silver pieces, and a platinum piece is worth ten gold pieces.",
        "\n",
        "A standard coin weighs about a third of an ounce, so fifty coins weigh a pound.",
        "\n",
        "Source: Player's Handbook, page 143",
      ],
    },
    {
      name: "Platinum",
      shortName: "pp",
      weight: "0.02",
      description: [
        "Common coins come in several different denominations based on the relative worth of the metal from which they are made. The three most common coins are the gold piece (gp), the silver piece (sp), and the copper piece (cp).",
        "\n",
        "With one gold piece, a character can buy a belt pouch, 50 feet of good rope, or a goat. A skilled (but not exceptional) artisan can earn one gold piece a day. The gold piece is the standard unit of measure for wealth, even if the coin itself is not commonly used. When merchants discuss deals that involve goods or services worth hundreds or thousands of gold pieces, the transactions don't usually involve the exchange of individual coins. Rather, the gold piece is a standard measure of value, and the actual exchange is in gold bars, letters of credit, or valuable goods.",
        "\n",
        "One gold piece is worth ten silver pieces, the most prevalent coin among commoners. A silver piece buys a laborer's work for a day, a flask of lamp oil, or a night's rest in a poor inn.",
        "\n",
        "One silver piece is worth ten copper pieces, which are common among laborers and beggars. A single copper piece buys a candle, a torch, or a piece of chalk.",
        "\n",
        "In addition, unusual coins made of other precious metals sometimes appear in treasure hoards. The electrum piece (ep) and the platinum piece (pp) originate from fallen empires and lost kingdoms, and they sometimes arouse suspicion and skepticism when used in transactions. An electrum piece is worth five silver pieces, and a platinum piece is worth ten gold pieces.",
        "\n",
        "A standard coin weighs about a third of an ounce, so fifty coins weigh a pound.",
        "\n",
        "Source: Player's Handbook, page 143",
      ],
    },
    {
      name: "Silver",
      shortName: "sp",
      weight: "0.02",
      description: [
        "Common coins come in several different denominations based on the relative worth of the metal from which they are made. The three most common coins are the gold piece (gp), the silver piece (sp), and the copper piece (cp).",
        "\n",
        "With one gold piece, a character can buy a belt pouch, 50 feet of good rope, or a goat. A skilled (but not exceptional) artisan can earn one gold piece a day. The gold piece is the standard unit of measure for wealth, even if the coin itself is not commonly used. When merchants discuss deals that involve goods or services worth hundreds or thousands of gold pieces, the transactions don't usually involve the exchange of individual coins. Rather, the gold piece is a standard measure of value, and the actual exchange is in gold bars, letters of credit, or valuable goods.",
        "\n",
        "One gold piece is worth ten silver pieces, the most prevalent coin among commoners. A silver piece buys a laborer's work for a day, a flask of lamp oil, or a night's rest in a poor inn.",
        "\n",
        "One silver piece is worth ten copper pieces, which are common among laborers and beggars. A single copper piece buys a candle, a torch, or a piece of chalk.",
        "\n",
        "In addition, unusual coins made of other precious metals sometimes appear in treasure hoards. The electrum piece (ep) and the platinum piece (pp) originate from fallen empires and lost kingdoms, and they sometimes arouse suspicion and skepticism when used in transactions. An electrum piece is worth five silver pieces, and a platinum piece is worth ten gold pieces.",
        "\n",
        "A standard coin weighs about a third of an ounce, so fifty coins weigh a pound.",
        "\n",
        "Source: Player's Handbook, page 143",
      ],
    },
  ];

  // await Currency.insertMany(
  //   currencies.map((currency) => ({ ...currency, description: currency.description.join("\n") }))
  // );
}
