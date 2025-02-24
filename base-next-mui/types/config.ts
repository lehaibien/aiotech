export type SystemConfiguration = {
  banner: BannerConfiguration;
  email: EmailConfiguration;
};

export type BannerConfiguration = {
  title: string;
  description: string;
  imageUrl: string;
};

export type EmailConfiguration = {
  email: string;
  password: string;
  host: string;
  port: number;
};
