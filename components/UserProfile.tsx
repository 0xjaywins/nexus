// import { useMiniAppContext } from "./providers/farcaster-provider";

// export default function UserProfile() {
//   const { user } = useMiniAppContext();

//   if (!user) return <div>User context not available</div>;

//   return (
//     <div
//       className="user-profile"
//       style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
//     >
//       {user.pfpUrl && (
//         <img
//           src={user.pfpUrl}
//           alt={user.username}
//           style={{
//             width: 48,
//             height: 48,
//             borderRadius: "50%",
//             marginRight: 12,
//           }}
//         />
//       )}
//       <div>
//         <div style={{ fontWeight: "bold" }}>{user.displayName}</div>
//         <div style={{ color: "#aaa" }}>@{user.username}</div>
//         <div style={{ fontSize: "0.95em", marginTop: 2 }}>FID: {user.fid}</div>
//         {user.bio && (
//           <div style={{ fontSize: "0.95em", marginTop: 2 }}>{user.bio}</div>
//         )}
//       </div>
//     </div>
//   );
// }
