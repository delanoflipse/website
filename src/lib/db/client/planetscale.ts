
import { connect } from "@planetscale/database";

const planetscaleConfig = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export const planetscaleClient = connect(planetscaleConfig);

export const queryPlanetscale = async (query: string, args?: any, options?:any) => {
  const response = await planetscaleClient.execute(query, args, options);
  const { rows } = response;

  return rows;
}
