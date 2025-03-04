IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Brand] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [LogoUrl] nvarchar(255) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_BrandId] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Category] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_CategoryId] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Role] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Tag] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Tag] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Product] (
    [Id] uniqueidentifier NOT NULL,
    [Sku] nvarchar(50) NOT NULL,
    [Name] nvarchar(255) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [Price] decimal(10,2) NOT NULL,
    [Stock] int NOT NULL DEFAULT 0,
    [BrandId] uniqueidentifier NOT NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [ImageUrls] nvarchar(max) NOT NULL,
    [IsFeatured] bit NOT NULL DEFAULT CAST(0 AS bit),
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_ProductId] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Product_BrandId] FOREIGN KEY ([BrandId]) REFERENCES [Brand] ([Id]),
    CONSTRAINT [FK_Product_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([Id])
);
GO

CREATE TABLE [User] (
    [Id] uniqueidentifier NOT NULL,
    [UserName] varchar(50) NOT NULL,
    [FamilyName] nvarchar(255) NULL,
    [GivenName] nvarchar(255) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [PhoneNumber] nvarchar(15) NULL,
    [AvatarUrl] nvarchar(max) NULL,
    [Password] nvarchar(max) NOT NULL,
    [Salt] nvarchar(max) NOT NULL,
    [RoleId] uniqueidentifier NOT NULL,
    [IsLocked] bit NOT NULL DEFAULT CAST(0 AS bit),
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_User_Role_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [Role] ([Id])
);
GO

CREATE TABLE [CartItem] (
    [UserId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [Quantity] int NOT NULL DEFAULT 1,
    CONSTRAINT [PK_CartItem] PRIMARY KEY ([UserId], [ProductId]),
    CONSTRAINT [FK_CartItem_Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Product] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [ProductTags] (
    [ProductId] uniqueidentifier NOT NULL,
    [TagId] uniqueidentifier NOT NULL,
    CONSTRAINT [PK_ProductTags] PRIMARY KEY ([ProductId], [TagId]),
    CONSTRAINT [FK_ProductTags_Product_TagId] FOREIGN KEY ([TagId]) REFERENCES [Product] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProductTags_Tag_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Tag] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Order] (
    [Id] uniqueidentifier NOT NULL,
    [CustomerId] uniqueidentifier NOT NULL,
    [TrackingNumber] varchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [TotalPrice] float(10) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    [DeliveryDate] datetime2 NULL,
    [Note] nvarchar(1000) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_OrderId] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Order_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [User] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Review] (
    [Id] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Rating] float NOT NULL DEFAULT 1.0E0,
    [Comment] nvarchar(1000) NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_ReviewId] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_Review_Rating] CHECK (Rating BETWEEN 1 AND 5),
    CONSTRAINT [FK_Review_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Product] ([Id]),
    CONSTRAINT [FK_Review_UserId] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [OrderItem] (
    [Id] uniqueidentifier NOT NULL,
    [OrderId] uniqueidentifier NOT NULL,
    [ProductId] uniqueidentifier NOT NULL,
    [Quantity] int NOT NULL DEFAULT 1,
    [Price] float(10) NOT NULL DEFAULT 0.0E0,
    CONSTRAINT [PK_OrderItemId] PRIMARY KEY ([Id]),
    CONSTRAINT [CK_OrderItem_Price] CHECK (Price >= 0),
    CONSTRAINT [CK_OrderItem_Quantity] CHECK (Quantity > 0),
    CONSTRAINT [FK_OrderItem_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Order] ([Id]),
    CONSTRAINT [FK_OrderItem_Product_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Product] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [Payment] (
    [Id] uniqueidentifier NOT NULL,
    [OrderId] uniqueidentifier NOT NULL,
    [TransactionId] nvarchar(max) NOT NULL,
    [Amount] float NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [Provider] int NOT NULL,
    CONSTRAINT [PK_Payment] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payment_Order_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Order] ([Id]) ON DELETE CASCADE
);
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedBy', N'CreatedDate', N'DeletedBy', N'DeletedDate', N'IsDeleted', N'Name', N'UpdatedBy', N'UpdatedDate') AND [object_id] = OBJECT_ID(N'[Role]'))
    SET IDENTITY_INSERT [Role] ON;
INSERT INTO [Role] ([Id], [CreatedBy], [CreatedDate], [DeletedBy], [DeletedDate], [IsDeleted], [Name], [UpdatedBy], [UpdatedDate])
VALUES ('85844e35-f6a0-4f8e-90c4-071366bf5ff6', 'system', '2025-02-05T10:15:51.4198432+07:00', NULL, NULL, CAST(0 AS bit), N'Admin', NULL, NULL),
('a8b42a83-b1bc-4937-99d9-0aaa70b896e5', 'system', '2025-02-05T10:15:51.4198444+07:00', NULL, NULL, CAST(0 AS bit), N'User', NULL, NULL);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CreatedBy', N'CreatedDate', N'DeletedBy', N'DeletedDate', N'IsDeleted', N'Name', N'UpdatedBy', N'UpdatedDate') AND [object_id] = OBJECT_ID(N'[Role]'))
    SET IDENTITY_INSERT [Role] OFF;
GO

CREATE INDEX [IX_CartItem_ProductId] ON [CartItem] ([ProductId]);
GO

CREATE INDEX [IX_Order_CustomerId] ON [Order] ([CustomerId]);
GO

CREATE INDEX [IX_OrderItem_OrderId] ON [OrderItem] ([OrderId]);
GO

CREATE INDEX [IX_OrderItem_ProductId] ON [OrderItem] ([ProductId]);
GO

CREATE UNIQUE INDEX [IX_Payment_OrderId] ON [Payment] ([OrderId]);
GO

CREATE INDEX [IX_Product_BrandId] ON [Product] ([BrandId]);
GO

CREATE INDEX [IX_Product_CategoryId] ON [Product] ([CategoryId]);
GO

CREATE INDEX [IX_ProductTags_TagId] ON [ProductTags] ([TagId]);
GO

CREATE INDEX [IX_Review_ProductId] ON [Review] ([ProductId]);
GO

CREATE INDEX [IX_Review_UserId] ON [Review] ([UserId]);
GO

CREATE INDEX [IX_User_RoleId] ON [User] ([RoleId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250205031552_Initial', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Order] ADD [Name] nvarchar(max) NULL;
GO

ALTER TABLE [Order] ADD [PhoneNumber] nvarchar(max) NULL;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-05T10:32:27.1659614+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-05T10:32:27.1659628+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250205033227_AddOrderField', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Payment]') AND [c].[name] = N'Provider');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Payment] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Payment] ALTER COLUMN [Provider] nvarchar(max) NOT NULL;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-05T19:32:43.0152266+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-05T19:32:43.0152278+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250205123243_UpdatePaymentEnum', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP TABLE [ProductTags];
GO

DROP TABLE [Tag];
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Brand]') AND [c].[name] = N'LogoUrl');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Brand] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Brand] DROP COLUMN [LogoUrl];
GO

ALTER TABLE [Product] ADD [DiscountPrice] decimal(10,2) NULL;
GO

ALTER TABLE [Product] ADD [Tags] nvarchar(max) NOT NULL DEFAULT N'[]';
GO

ALTER TABLE [Category] ADD [ImageUrl] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [Brand] ADD [ImageUrl] nvarchar(max) NOT NULL DEFAULT N'';
GO

CREATE TABLE [Post] (
    [Id] uniqueidentifier NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [IsPublished] bit NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_PostId] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Template] (
    [Id] uniqueidentifier NOT NULL,
    [Name] varchar(255) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [CreatedBy] varchar(255) NOT NULL,
    [UpdatedDate] datetime2 NULL,
    [UpdatedBy] varchar(255) NULL,
    [DeletedDate] datetime2 NULL,
    [DeletedBy] varchar(255) NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_TemplateId] PRIMARY KEY ([Id])
);
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-12T22:25:54.2490489+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-12T22:25:54.2490501+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

ALTER TABLE [Product] ADD CONSTRAINT [CK_Product_DiscountPrice] CHECK (DiscountPrice >= 0 AND DiscountPrice <= Price);
GO

ALTER TABLE [Product] ADD CONSTRAINT [CK_Product_Price] CHECK (Price > 0);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250212152554_AddPost', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Post]') AND [c].[name] = N'IsPublished');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Post] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Post] ADD DEFAULT CAST(1 AS bit) FOR [IsPublished];
GO

ALTER TABLE [Post] ADD [ImageUrl] nvarchar(max) NOT NULL DEFAULT N'';
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T08:48:21.6444981+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T08:48:21.6444997+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250213014822_AddThumbnailToPost', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP TABLE [Template];
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T08:53:48.6948124+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T08:53:48.6948138+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250213015349_RemoveTemplate', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Configuration] (
    [Id] uniqueidentifier NOT NULL,
    [Key] varchar(255) NOT NULL,
    [Value] nvarchar(255) NOT NULL,
    CONSTRAINT [PK_Configuration] PRIMARY KEY ([Id])
);
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T14:39:43.6230757+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-13T14:39:43.6230770+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

CREATE UNIQUE INDEX [IX_Configuration_Key] ON [Configuration] ([Key]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250213073944_AddConfiguration', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Configuration]') AND [c].[name] = N'Value');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Configuration] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [Configuration] ALTER COLUMN [Value] nvarchar(max) NOT NULL;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-14T14:11:07.2344964+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-14T14:11:07.2344977+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250214071107_ChangeValueLengthOfConfiguration', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

EXEC sp_rename N'[Payment].[CreatedAt]', N'CreatedDate', N'COLUMN';
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-17T15:45:01.5343456+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-17T15:45:01.5343473+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250217084502_ChangeMisnamedPropertyToCreatedDate', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Order] ADD [CancelReason] nvarchar(1000) NULL;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-21T12:21:18.8041039+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-21T12:21:18.8041052+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250221052119_AddOrderCancelReason', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Post] ADD [Tags] nvarchar(max) NOT NULL DEFAULT N'[]';
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-21T16:16:15.0001212+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-21T16:16:15.0001223+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250221091615_UpdatePost', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [User] ADD [Address] nvarchar(max) NULL;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-22T10:24:20.4875278+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-22T10:24:20.4875290+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250222032421_AddAddressToUser', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [EmailChange] (
    [UserId] uniqueidentifier NOT NULL,
    [OldEmail] nvarchar(255) NOT NULL,
    [NewEmail] nvarchar(255) NOT NULL,
    [Token] nvarchar(max) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [ExpiryDate] datetime2 NOT NULL,
    CONSTRAINT [PK_EmailChangeUserId] PRIMARY KEY ([UserId]),
    CONSTRAINT [FK_EmailChange_UserId] FOREIGN KEY ([UserId]) REFERENCES [User] ([Id]) ON DELETE CASCADE
);
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-22T13:48:23.8090070+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-22T13:48:23.8090084+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250222064824_AddEmailChangeTable', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Review] DROP CONSTRAINT [CK_Review_Rating];
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Review]') AND [c].[name] = N'Rating');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Review] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Review] ALTER COLUMN [Rating] int NOT NULL;
ALTER TABLE [Review] ADD DEFAULT 1 FOR [Rating];
GO

ALTER TABLE [Review] ADD CONSTRAINT [CK_Review_Rating] CHECK (Rating >= 0 AND Rating <= 5);
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T09:43:44.2449807+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T09:43:44.2449825+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250223024344_ChangeRatingToInteger', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T10:17:09.7093826+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T10:17:09.7093839+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250223031710_ChangePostTagNullable', N'8.0.10');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Order] ADD [Tax] float NOT NULL DEFAULT 0.0E0;
GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T15:29:53.0708009+07:00'
WHERE [Id] = '85844e35-f6a0-4f8e-90c4-071366bf5ff6';
SELECT @@ROWCOUNT;

GO

UPDATE [Role] SET [CreatedDate] = '2025-02-23T15:29:53.0708025+07:00'
WHERE [Id] = 'a8b42a83-b1bc-4937-99d9-0aaa70b896e5';
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250223082953_AddTaxToOrder', N'8.0.10');
GO

COMMIT;
GO

