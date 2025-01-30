import { Identity } from "@dfinity/agent";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "../../../styles/index.module.css";
import { LogoutButton, useAuth, useCandidActor, useIdentities } from "@bundly/ares-react";

import { CandidActors } from "@app/canisters";
import { Box, Button, Grid, Stack } from "@mantine/core";
import Layout from "@app/components/Layout/Layout";
import Image from "next/image";

type Profile = {
  username: string;
  bio: string;
};

export default function IcConnectPage() {
  const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
  const identities = useIdentities();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [loading, setLoading] = useState(false); // State for loader
  const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
    canisterId: process.env.NEXT_PUBLIC_TEST_CANISTER_ID,
  }) as CandidActors["w3t"];

  useEffect(() => {
    getProfile();
  }, [currentIdentity]);

  function formatPrincipal(principal: string): string {
    const parts = principal.split("-");
    const firstPart = parts.slice(0, 2).join("-");
    const lastPart = parts.slice(-2).join("-");
    return `${firstPart}-...-${lastPart}`;
  }

  function disableIdentityButton(identityButton: Identity): boolean {
    return currentIdentity.getPrincipal().toString() === identityButton.getPrincipal().toString();
  }

  async function getProfile() {
    try {
      const response = await w3t.getAllReports();

      if ("err" in response) {
        if ("userNotAuthorized" in response.err) console.log("User not authorized");
        else console.log("Error fetching profile");
      }

      const profile = "ok" in response ? response.ok : undefined;
      console.log(profile)
      // setProfile(profile);
    } catch (error) {
      console.error({ error });
    }
  }

  // async function registerProfile(username: string, bio: string) {
  //   try {
  //     setLoading(true); // Show loader
  //     const response = await test.createProfile(username, bio);

  //     if ("err" in response) {
  //       if ("userNotAuthenticated" in response.err) alert("User not authenticated");
  //       if ("profileAlreadyExists" in response.err) alert("Profile already exists");

  //       throw new Error("Error creating profile");
  //     }

  //     setProfile({ username, bio });
  //   } catch (error) {
  //     console.error({ error });
  //   } finally {
  //     setLoading(false); // Hide loader
  //   }
  // }

  return (
    <Box className={styles.allContainer}>
      <Box className="centerContainer">
        <Grid
          style={{
            paddingTop:"40px"
          }}
        >
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Stack
              align="flex-start"
              justify="space-between"
              gap="md"
              h={"100%"}
            >
              <Stack
                align="stretch"
                justify="flex-start"
                gap="md"
              >
                <Box className={styles.title}>
                  W3T
                </Box>
                <Box className={styles.subTitle}>
                  Project Description
                </Box>
              </Stack>
              <Button
                variant="filled"
                color="rgba(95, 147, 107, 1)"
              >
                Upload Your Evidence
              </Button>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Box className={styles.imageContainer}>
              <Image 
                src={"/placeholder.webp"}
                width={400}
                alt="W"
                height={200}
              />
            </Box>
          </Grid.Col>
        </Grid>
        <Grid
          style={{
            marginTop:"40px"
          }}
        >
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Box className={styles.imageContainer}>
                <Image 
                  src={"/placeholder.webp"}
                  width={400}
                  alt="W"
                  height={200}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack
                align="flex-start"
                justify="space-between"
                gap="md"
                h={"100%"}
              >
                <Stack
                  align="stretch"
                  justify="flex-start"
                  gap="md"
                >
                  <Box className={styles.title}>
                    Why W3T
                  </Box>
                  <Box  className={styles.subTitle}>
                    Why W3T Description
                  </Box>
                </Stack>
                <Button
                  variant="filled"
                  color="rgba(95, 147, 107, 1)"
                >
                  Get Yours
                </Button>
              </Stack>
            </Grid.Col>
        </Grid>
      </Box>
      {/* <main className="p-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </p>
              <p className="text-gray-700">
                <strong>Current Identity:</strong> {currentIdentity.getPrincipal().toString()}
              </p>
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              {profile ? (
                <>
                  <p>
                    <strong>Username: </strong> {profile.username}
                  </p>
                  <p>
                    <strong>Bio: </strong> {profile.bio}
                  </p>
                </>
              ) : (
                <CreateProfileForm onSubmit={registerProfile} loading={loading} />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Identities</h2>
              <ul className="divide-y divide-gray-200">
                {identities.map((identity, index) => (
                  <li key={index} className="flex items-center justify-between py-4">
                    <span className="text-gray-900">
                      {identity.provider} : {formatPrincipal(identity.identity.getPrincipal().toString())}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className={`px-3 py-1 text-sm rounded-md ${
                          disableIdentityButton(identity.identity)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white"
                        }`}
                        disabled={disableIdentityButton(identity.identity)}
                        onClick={() => changeCurrentIdentity(identity.identity)}>
                        Select
                      </button>
                      <LogoutButton identity={identity.identity} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main> */}
    </Box>
  );
}

type ProfileFormProps = {
  onSubmit: (username: string, bio: string) => Promise<void>;
  loading: boolean; // Loader state
};

function CreateProfileForm({ onSubmit, loading }: ProfileFormProps) {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit(username, bio);
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setBio("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="bio"
          placeholder="Bio"
          value={bio}
          onChange={handleBioChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Creating Profile..." : "Create Profile"}
        </button>
      </div>
    </form>
  );
}
