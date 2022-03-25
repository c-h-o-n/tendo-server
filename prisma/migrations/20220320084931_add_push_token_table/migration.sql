-- CreateTable
CREATE TABLE "PushToken" (
    "userId" UUID NOT NULL,
    "pushToken" VARCHAR(41) NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("userId","pushToken")
);
